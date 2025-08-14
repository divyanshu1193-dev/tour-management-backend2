const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Dashboard statistics
router.get('/', async (req, res) => {
    try {
        const [applications, tours, alerts, users] = await Promise.all([
            pool.query(`
                SELECT status, COUNT(*) as count 
                FROM tour_applications 
                GROUP BY status
            `),
            pool.query(`
                SELECT tour_status, COUNT(*) as count
                FROM tours
                GROUP BY tour_status
            `),
            pool.query(`
                SELECT type, COUNT(*) as count
                FROM alerts
                WHERE status = 'unread'
                GROUP BY type
            `),
            pool.query(`SELECT COUNT(*) as count FROM users WHERE status = 'active'`)
        ]);
        res.json({
            applications: applications.rows,
            tours: tours.rows,
            alerts: alerts.rows,
            activeUsers: users.rows[0].count
        });
    } catch (err) {
        console.error('Stats API error:', err);
        res.status(500).json({ error: 'Database error: ' + err.message });
    }
});

module.exports = router;
