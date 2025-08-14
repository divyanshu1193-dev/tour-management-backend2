// routes/ulb.js
const express = require('express');
const pool = require('../config/db'); // your db connection
const router = express.Router();

// Get unique districts
router.get('/districts', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT district_name 
       FROM ulb_master 
       WHERE district_name IS NOT NULL 
       ORDER BY district_name`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching districts:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get ULBs by district
router.get('/ulbs', async (req, res) => {
  const { district } = req.query;
  if (!district) return res.status(400).json({ error: 'District is required' });

  try {
    const result = await pool.query(
      `SELECT ulb_name_en 
       FROM ulb_master 
       WHERE district_name = $1 
       ORDER BY ulb_name_en`,
      [district]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching ULBs:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
