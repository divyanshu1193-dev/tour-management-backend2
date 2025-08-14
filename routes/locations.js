const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Insert new location
router.post('/', async (req, res) => {
    try {
        const { user_id, latitude, longitude, accuracy, location_name, address, speed, battery_level } = req.body;
        const result = await pool.query(`
            INSERT INTO employee_locations
            (user_id, latitude, longitude, accuracy, location_name, address, speed, battery_level)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `, [user_id, latitude, longitude, accuracy, location_name, address, speed, battery_level]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Location update error:', err);
        res.status(500).json({ error: 'Database error: ' + err.message });
    }
});

// Get latest locations
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT DISTINCT ON (el.user_id)
                   el.*, u.full_name, u.employee_id
            FROM employee_locations el
            JOIN users u ON el.user_id = u.id
            WHERE el.timestamp > NOW() - INTERVAL '1 hour'
            ORDER BY el.user_id, el.timestamp DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Locations API error:', err);
        res.status(500).json({ error: 'Database error: ' + err.message });
    }
});

module.exports = router;
