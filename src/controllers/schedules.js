import { pool } from "../db/db.js";

// GET - get all schedule
export const getAllSchedule = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.id AS schedule_id,
        s.medicine_id,
        m.name AS medicine_name,
        s.datetime
      FROM medicine_schedules s
      JOIN medicines m ON s.medicine_id = m.id
      ORDER BY s.medicine_id, s.datetime;
      `);
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Failed to get schedule" });
  }
};

// PUT - create schedule
export const createSchedule = async (req, res) => {
  const { medicine_id } = req.params;
  const { datetime } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO medicine_schedules (medicine_id, datetime) VALUES ($1, $2) RETURNING *`,
      [medicine_id, datetime]
    );

    res.json({ status: "ok", msg: "Schedule added", data: result.rows[0] });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Failed to add schedule" });
  }
};

// PATCH - update schedule datetime
export const updateSchedule = async (req, res) => {
  const { schedule_id } = req.params;
  const { datetime } = req.body;

  try {
    const exists = await pool.query(
      "SELECT id FROM medicine_schedules WHERE id = $1::integer",
      [schedule_id]
    );
    if (exists.rows.length === 0) {
      return res
        .status(404)
        .json({ status: "error", msg: "Schedule not found" });
    }

    const result = await pool.query(
      `
      UPDATE medicine_schedules
      SET datetime = $1::timestamptz
      WHERE id = $2::integer
      RETURNING *;
      `,
      [datetime, schedule_id]
    );

    await pool.query(
      `UPDATE medicine_logs
       SET datetime = $1::timestamptz
       WHERE schedule_id = $2::integer`,
      [datetime, schedule_id]
    );

    if (result.rows.length === 0) {
      return res.json({ status: "ok", msg: "No changes detected" });
    }

    res.json({ status: "ok", msg: "Datetime updated", data: result.rows[0] });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Error updating datetime" });
  }
};

// DELETE - delete schedule datetime
export const deleteScheduleById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM medicine_schedules WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ status: "error", msg: "Schedule not found" });
    }

    res.json({ status: "ok", msg: "Schedule deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Error deleting schedule" });
  }
};
