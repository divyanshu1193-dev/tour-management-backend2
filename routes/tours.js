const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const upload = require("../middleware/upload");

// ==========================
// GET tours with optional filters
// ==========================
router.get("/", async (req, res) => {
  try {
    const { status } = req.query;
    const employee_id = req.query.employee_id || null;

    console.log("GET /tours filters:", req.query);

    // Auto-complete expired tours
    await pool.query(`
      UPDATE tours
      SET tour_status = 'completed',
          travel_status = 'completed',
          completion_status = CASE
              WHEN completion_status = 'not-uploaded' THEN 'pending-verification'
              ELSE completion_status
          END,
          updated_at = NOW()
      WHERE to_date < CURRENT_DATE
        AND tour_status != 'completed'
    `);

    let query = `
      SELECT
        t.*, u.full_name, u.employee_id, u.department,
        ta.type as application_type, ta.priority, ta.travel_mode
      FROM tours t
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN tour_applications ta ON t.application_id = ta.id
    `;

    const params = [];
    const conditions = [];

    // Optional status filter
    if (status && status !== "all") {
      conditions.push(`t.tour_status = $${params.length + 1}`);
      params.push(status);
    }

    // Employee filter
    if (employee_id) {
      conditions.push(`t.employee_id = $${params.length + 1}`);
      params.push(employee_id);
    }

    // By default, show only upcoming or completed tours
    if (!status || status === "all") {
      conditions.push(`t.tour_status IN ('upcoming', 'completed')`);
    }

    if (conditions.length > 0) query += " WHERE " + conditions.join(" AND ");
    query += " ORDER BY t.created_at DESC";

    const result = await pool.query(query, params);
    console.log("Tours found:", result.rows.length);
    res.json(result.rows);
  } catch (err) {
    console.error("Tours API error:", err);
    res.status(500).json({ error: "Database error: " + err.message });
  }
});

// ==========================
// Submit tour completion
// ==========================
router.put("/:id/completion", upload.single("completion_image"), async (req, res) => {
  const client = await pool.connect();
  console.log(`PUT /tours/${req.params.id}/completion`, req.body);

  try {
    await client.query("BEGIN");
    const { id } = req.params;
    const { completion_description, completion_location, completion_coordinates } = req.body;

    let completion_image = null;
    let completion_image_name = null;
    if (req.file) {
      completion_image = "/uploads/" + req.file.filename;
      completion_image_name = req.file.originalname;
    }

    const tourResult = await client.query(`
      UPDATE tours
      SET completion_status = 'pending',
          completion_image = $1,
          completion_image_name = $2,
          completion_description = $3,
          completion_location = $4,
          completion_coordinates = $5,
          submitted_at = NOW(),
          updated_at = NOW()
      WHERE id = $6
      RETURNING *
    `, [completion_image, completion_image_name, completion_description, completion_location, completion_coordinates, id]);

    if (tourResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Tour not found" });
    }

    console.log("Tour completion updated:", tourResult.rows[0].id);

    await client.query(`
      INSERT INTO alerts (user_id, type, category, title, message, related_id, related_type, priority)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      null, "info", "tour", "Tour Completion Submitted",
      `Tour completion submitted for ${tourResult.rows[0].request_no} - requires verification`,
      tourResult.rows[0].id, "tour", "high"
    ]);

    await client.query("COMMIT");
    res.json(tourResult.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Tour completion error:", err);
    res.status(500).json({ error: "Database error: " + err.message });
  } finally {
    client.release();
  }
});

// ==========================
// Verify completion
// ==========================
router.put("/:id/verify", async (req, res) => {
  const client = await pool.connect();
  console.log(`PUT /tours/${req.params.id}/verify`, req.body);

  try {
    await client.query("BEGIN");
    const { id } = req.params;
    const { verification_status, verification_comments, verified_by } = req.body;

    const tourResult = await client.query(`
      UPDATE tours
      SET completion_status = $1,
          verification_comments = $2,
          verified_by = $3,
          verified_at = CASE WHEN $1 = 'verified' THEN NOW() ELSE NULL END,
          updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `, [verification_status, verification_comments, verified_by, id]);

    if (tourResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Tour not found" });
    }

    await client.query(`
      INSERT INTO alerts (user_id, type, category, title, message, related_id, related_type, priority)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      tourResult.rows[0].user_id,
      verification_status === "verified" ? "success" : "warning",
      "tour",
      `Tour Completion ${verification_status === "verified" ? "Verified" : "Rejected"}`,
      `Your tour completion for ${tourResult.rows[0].request_no} has been ${verification_status}${verification_comments ? ": " + verification_comments : ""}`,
      tourResult.rows[0].id, "tour", "normal"
    ]);

    await client.query("COMMIT");
    res.json(tourResult.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Tour verify error:", err);
    res.status(500).json({ error: "Database error: " + err.message });
  } finally {
    client.release();
  }
});

// ==========================
// Pending verification list
// ==========================
router.get("/pending-verification", async (req, res) => {
  try {
    const { employee_id } = req.query;
    console.log("GET /tours/pending-verification filters:", req.query);

    let query = `
      SELECT t.*, u.full_name, u.employee_id, u.department,
             ta.type as application_type, ta.priority
      FROM tours t
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN tour_applications ta ON t.application_id = ta.id
      WHERE t.completion_status = 'pending'
    `;
    const params = [];

    if (employee_id) {
      query += ` AND t.employee_id = $${params.length + 1}`;
      params.push(employee_id);
    }

    query += " ORDER BY t.submitted_at ASC";

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error("Pending verification error:", err);
    res.status(500).json({ error: "Database error: " + err.message });
  }
});

module.exports = router;
