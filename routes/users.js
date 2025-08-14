const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all users
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, employee_id, full_name, email, department, designation,
                   role, status, phone, created_at, last_active
            FROM users
            ORDER BY full_name
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Users API error:', err);
        res.status(500).json({ error: 'Database error: ' + err.message });
    }
});

// Create user
router.post('/', async (req, res) => {
    try {
        const { employee_id, full_name, email, department, designation, role, phone } = req.body;
        const result = await pool.query(`
            INSERT INTO users (employee_id, full_name, email, department, designation, role, phone)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `, [employee_id, full_name, email, department, designation, role, phone]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Create user error:', err);
        res.status(500).json({ error: 'Database error: ' + err.message });
    }
});

module.exports = router;
