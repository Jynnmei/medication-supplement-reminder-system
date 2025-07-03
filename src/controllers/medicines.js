import { pool } from "../db/db.js";

// GET - get all medicines
export const getAllMedicines = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        m.id,
        m.name,
        m.dosage,
        m.unit,
        m.instructions,
        s.id AS schedule_id,
        s.datetime AS schedule_time,
        l.id AS log_id,
        l.datetime AS log_time,
        l.taken
      FROM medicines m
      LEFT JOIN medicine_schedules s ON s.medicine_id = m.id
      LEFT JOIN medicine_logs l ON l.schedule_id  = s.id
      ORDER BY m.id, s.datetime
      `);
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Failed to get medicines" });
  }
};

// PUT - create medicines
export const createMedicine = async (req, res) => {
  const { name, dosage, unit, instructions, datetime } = req.body;

  try {
    const medicineResult = await pool.query(
      `INSERT INTO medicines (name, dosage, unit, instructions)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, dosage, unit, instructions]
    );
    const medicine = medicineResult.rows[0];

    if (datetime) {
      const scheduleResult = await pool.query(
        `INSERT INTO medicine_schedules (medicine_id, datetime)
         VALUES ($1, $2)
         RETURNING *`,
        [medicine.id, new Date(datetime)]
      );
      const schedule = scheduleResult.rows[0];

      await pool.query(
        `INSERT INTO medicine_logs (medicine_id, schedule_id, datetime, taken)
           VALUES ($1, $2, $3, $4)`,
        [medicine.id, schedule.id, new Date(datetime), false] // taken = false
      );
    }

    res.json({ status: "ok", msg: "Medicine added", data: medicine });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Failed to add medicine" });
  }
};

// PATCH - update medicine
export const updateMedicine = async (req, res) => {
  const { id } = req.params;
  const { name, dosage, unit, instructions } = req.body;

  try {
    const exists = await pool.query(
      "SELECT id FROM medicines WHERE id = $1::integer",
      [id]
    );
    if (exists.rows.length === 0) {
      return res
        .status(404)
        .json({ status: "error", msg: "Medicine not found" });
    }

    const result = await pool.query(
      `
      UPDATE medicines
      SET
        name = CASE 
              WHEN $1::varchar IS NOT NULL AND name IS DISTINCT FROM $1::varchar THEN $1::varchar
              ELSE name 
              END,
        dosage = CASE 
              WHEN $2::varchar IS NOT NULL AND dosage IS DISTINCT FROM $2::varchar THEN $2::varchar 
              ELSE dosage 
              END,
        unit = CASE 
              WHEN $3::varchar IS NOT NULL AND unit IS DISTINCT FROM $3::varchar THEN $3::varchar
              ELSE unit 
              END,
        instructions = CASE 
              WHEN $4::varchar IS NOT NULL AND instructions IS DISTINCT FROM $4::varchar THEN $4::varchar 
              ELSE instructions 
              END
        WHERE id = $5::integer
        RETURNING *;
      `,
      [name, dosage, unit, instructions, id]
    );

    if (result.rows.length === 0) {
      return res.json({ status: "ok", msg: "No changes detected" });
    }

    res.json({ status: "ok", msg: "Medicine updated", data: result.rows[0] });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Error updating medicine" });
  }
};

// DELETE - delete medicine
export const deleteMedicineById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM medicines WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ status: "error", msg: "Medicine not found" });
    }

    res.json({ status: "ok", msg: "Medicine deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "Error deleting medicine" });
  }
};
