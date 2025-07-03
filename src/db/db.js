import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const connectDB = async () => {
  try {
    await pool.connect();
    console.log("PostgreSQL connected successfully.");
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};

export { connectDB, pool };
