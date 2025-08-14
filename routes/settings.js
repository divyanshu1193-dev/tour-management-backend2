const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all settings
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM system_settings ORDER BY setting_key');
        res.json(result.rows);
    } catch (err) {
        console.error('Settings API error:', err);
        res.status(500).json({ error: 'Database error: ' + err.message });
    }
});

// Update setting
router.put('/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const { value } = req.body;
        const result = await pool.query(`
            UPDATE system_settings
            SET setting_value = $1, updated_at = NOW()
            WHERE setting_key = $2
            RETURNING *
        `, [value, key]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Setting not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Update setting error:', err);
        res.status(500).json({ error: 'Database error: ' + err.message });
    }
});

module.exports = router;
