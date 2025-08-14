const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const upload = require('../middleware/upload');

// =========================
// GET Applications
// =========================
router.get('/', async (req, res) => {
    try {
        const { status, employee_id } = req.query;
        console.log('GET /applications filters:', req.query);

        let query = `
            SELECT
                ta.*, u.full_name, u.employee_id AS user_employee_id, u.department,
                t.request_no, t.tour_status, t.completion_status
            FROM tour_applications ta
            LEFT JOIN users u ON ta.user_id = u.id
            LEFT JOIN tours t ON ta.id = t.application_id
        `;
        const params = [];
        const conditions = [];

        if (status && status !== 'all') {
            conditions.push(`ta.status = $${params.length + 1}`);
            params.push(status);
        }
        if (employee_id) {
            conditions.push(`ta.employee_id = $${params.length + 1}`);
            params.push(employee_id);
        }
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY ta.submitted_date DESC';

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error('Applications GET error:', err);
        res.status(500).json({ error: err.message });
    }
});

// =========================
// POST New Application
// =========================
router.post('/', upload.array('supporting_documents', 5), async (req, res) => {
    const client = await pool.connect();
    console.log('---- New Application Submission ----');
    console.log('Body:', req.body);
    console.log('Files count:', req.files?.length || 0);

    try {
        await client.query('BEGIN');
        const {
            user_id, type, origin, destination, from_date, to_date, from_time, to_time,
            purpose, travel_mode, accommodation_required, transport_required,
            estimated_cost, priority, urgency
        } = req.body;

        // Get employee_id for user
        const empRes = await client.query('SELECT employee_id FROM users WHERE id = $1', [user_id]);
        const employee_id = empRes.rows[0]?.employee_id || null;
        console.log('Resolved employee_id:', employee_id);

        const application_id = 'APP' + Date.now();
        const supporting_documents = (req.files || []).map(f => ({
            filename: f.filename,
            originalname: f.originalname,
            path: f.path,
            size: f.size
        }));

        const applicationResult = await client.query(`
            INSERT INTO tour_applications (
            application_id, user_id, employee_id, type, origin, destination,
            from_date, to_date, from_time, to_time, purpose, travel_mode,
            accommodation_required, transport_required, estimated_cost,
            priority, urgency, supporting_documents
        ) VALUES (
            $1, $2, $3, $4, $5, $6,
            $7, $8, $9, $10, $11, $12,
            $13, $14, $15,
            $16, $17, $18
        )
        RETURNING *
        `, [
            application_id, user_id, employee_id, type, origin, destination, from_date, to_date,
            from_time, to_time, purpose, travel_mode, accommodation_required === 'true',
            transport_required === 'true', estimated_cost, priority, urgency,
            JSON.stringify(supporting_documents)
        ]);

        console.log('DB insert result:', applicationResult.rows[0]);

        await client.query(`
            INSERT INTO alerts (user_id, type, category, title, message, related_id, related_type, priority)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        `, [
            null, 'info', 'application', 'New Application Submitted',
            `New ${type} application ${application_id} submitted by user ${user_id}`,
            applicationResult.rows[0].id, 'application', 'high'
        ]);

        await client.query('COMMIT');
        res.json(applicationResult.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Application POST error:', err);
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

// =========================
// PUT Update Application Status
// =========================
router.put('/:id/status', async (req, res) => {
    const client = await pool.connect();
    console.log(`---- Updating application ${req.params.id} ----`);
    console.log('Body:', req.body);

    try {
        await client.query('BEGIN');
        const { id } = req.params;
        const { status, comments } = req.body;

        const applicationResult = await client.query(`
            UPDATE tour_applications
            SET status=$1, comments=$2,
                approved_date = CASE WHEN $1='approved' THEN NOW() ELSE approved_date END,
                rejected_date = CASE WHEN $1='rejected' THEN NOW() ELSE rejected_date END,
                updated_at = NOW()
            WHERE id=$3
            RETURNING *
        `, [status, comments, id]);

        if (!applicationResult.rows.length) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Application not found' });
        }

        const appRow = applicationResult.rows[0];
        console.log('Updated application row:', appRow);

        // Alert for status change
        await client.query(`
            INSERT INTO alerts (user_id,type,category,title,message,related_id,related_type,priority)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        `, [
            appRow.user_id, status === 'approved' ? 'success' : 'warning', 'application',
            `Application ${status}`,
            `Your application ${appRow.application_id} has been ${status}${comments ? ': ' + comments : ''}`,
            appRow.id, 'application', 'normal'
        ]);

        // If approved → also add to tours
        if (status === 'approved') {
            const requestNo = 'REQ' + Date.now();

            // Ensure employee_id exists
            let employee_id = appRow.employee_id;
            if (!employee_id) {
                const empRes = await client.query(
                    'SELECT employee_id FROM users WHERE id = $1',
                    [appRow.user_id]
                );
                employee_id = empRes.rows[0]?.employee_id || null;
            }

            const tourResult = await client.query(`
                INSERT INTO tours (
                    request_no, user_id, employee_id, route, from_date, to_date, purpose, application_id,
                    tour_status, travel_status, tickets_booked, completion_status, created_at
                ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,NOW()) RETURNING *
            `, [
                requestNo, appRow.user_id, employee_id,
                `${appRow.origin} → ${appRow.destination}`,
                appRow.from_date, appRow.to_date, appRow.purpose, appRow.id,
                new Date(appRow.from_date) > new Date() ? 'upcoming' : 'ongoing',
                'not-started', false, 'not-uploaded'
            ]);

            console.log('Tour created from approved application:', tourResult.rows[0]);

            // Tour creation alert
            await client.query(`
                INSERT INTO alerts (user_id,type,category,title,message,related_id,related_type)
                VALUES ($1,$2,$3,$4,$5,$6,$7)
            `, [
                appRow.user_id, 'success', 'tour', 'Tour Created',
                `Your approved application has been converted to tour ${requestNo}`,
                tourResult.rows[0].id, 'tour'
            ]);
        }

        await client.query('COMMIT');
        res.json(applicationResult.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Status update error:', err);
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
});

module.exports = router;
