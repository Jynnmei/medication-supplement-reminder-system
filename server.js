import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectDB } from "./src/db/db.js";
import cors from "cors";
import helmet from "helmet";
// import rateLimit from "express-rate-limit";
import medicinesRoutes from "./src/routers/medicines.js";
import scheduleRoutes from "./src/routers/schedules.js";
import logsRoutes from "./src/routers/logs.js";
import reminderRoutes from "./src/routers/getReminders.js";

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   standardHeaders: true,
//   legacyHeaders: false,
// });

connectDB();
const app = express();

app.use(cors());
app.use(helmet());
// app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/medicines", medicinesRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/logs", logsRoutes);
app.use("/api/reminder", reminderRoutes);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error(err);
    return res.status(400).send({ status: 404, msg: "An error has occurred" });
  }
  next();
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
