import express from "express";
import {
  createSchedule,
  deleteScheduleById,
  getAllSchedule,
  updateSchedule,
} from "../controllers/schedules.js";

const router = express.Router();

router.get("/", getAllSchedule);
router.put("/:medicine_id", createSchedule);
router.patch("/:schedule_id", updateSchedule);
router.delete("/:id", deleteScheduleById);

export default router;
