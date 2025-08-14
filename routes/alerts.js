const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get alerts (with optional filters)
router.get('/', async (req, res) => {
    try {
        const { user_id, status, type } = req.query;
        let query = `
            SELECT a.*, u.full_name as related_user_name
            FROM alerts a
            LEFT JOIN users u ON a.user_id = u.id
        `;
        const params = [];
        const conditions = [];
        if (user_id) {
            conditions.push(`(a.user_id = $${params.length + 1} OR a.user_id IS NULL)`);
            params.push(user_id);
        }
        if (status && status !== 'all') {
            conditions.push(`a.status = $${params.length + 1}`);
            params.push(status);
        }
        if (type && type !== 'all') {
            conditions.push(`a.type = $${params.length + 1}`);
            params.push(type);
        }
        if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');
        query += ' ORDER BY a.created_at DESC LIMIT 50';
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error('Alerts API error:', err);
        res.status(500).json({ error: 'Database error: ' + err.message });
    }
});

// Mark alert as read
router.put('/:id/read', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`
            UPDATE alerts
            SET status = 'read', read_at = NOW()
            WHERE id = $1
            RETURNING *
        `, [id]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Mark alert read error:', err);
        res.status(500).json({ error: 'Database error: ' + err.message });
    }
});

module.exports = router;
