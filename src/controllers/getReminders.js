import { pool } from "../db/db.js";

// GET - get reminders
export const getTodayReminders = async (req, res) => {
  try {
    await pool.query(`
      INSERT INTO medicine_logs (medicine_id, schedule_id, datetime, taken)
      SELECT ms.medicine_id, ms.id, ms.datetime, false
      FROM medicine_schedules ms
      WHERE DATE(ms.datetime) = CURRENT_DATE
      AND NOT EXISTS (
        SELECT 1 FROM medicine_logs ml
        WHERE ml.schedule_id = ms.id
        AND DATE(ml.datetime) = CURRENT_DATE
      );
    `);

    const result = await pool.query(`
      SELECT 
        ms.id AS schedule_id,
        m.name,
        m.dosage,
        m.unit,
        m.instructions,
        ms.datetime,
        ml.taken
      FROM medicine_schedules ms
      JOIN medicines m ON ms.medicine_id = m.id
      LEFT JOIN medicine_logs ml 
        ON ml.schedule_id = ms.id 
        AND DATE(ml.datetime) = CURRENT_DATE
      WHERE DATE(ms.datetime) = CURRENT_DATE
      ORDER BY ms.datetime
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Failed to get reminders" });
  }
};
