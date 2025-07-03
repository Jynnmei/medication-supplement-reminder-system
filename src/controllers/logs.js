import { pool } from "../db/db.js";

// GET - get all logs
export const getAllLogs = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        l.id AS log_id,
        l.medicine_id,
        m.name AS medicine_name,
        l.schedule_id,
        l.datetime,
        l.taken
      FROM medicine_logs l
      JOIN medicines m ON m.id = l.medicine_id  
      JOIN medicine_schedules s ON s.id = l.schedule_id         
      ORDER BY l.datetime ASC;
      `);
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Failed to get schedule" });
  }
};

// PATCH - update logs
export const updateLogs = async (req, res) => {
  const { log_id } = req.params;
  const { taken } = req.body;

  try {
    const exists = await pool.query(
      "SELECT id FROM medicine_logs WHERE id = $1::integer",
      [log_id]
    );
    if (exists.rows.length === 0) {
      return res.status(404).json({ status: "error", msg: "Logs not found" });
    }

    const result = await pool.query(
      `
      UPDATE medicine_logs
      SET taken = $1::boolean
      WHERE id = $2::integer
      RETURNING *;
      `,
      [taken, log_id]
    );

    if (result.rows.length === 0) {
      return res.json({ status: "ok", msg: "No changes detected" });
    }

    res.json({ status: "ok", msg: "Logs updated", data: result.rows[0] });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Error updating logs" });
  }
};
