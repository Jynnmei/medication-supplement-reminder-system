import express from "express";
import { getTodayReminders } from "../controllers/getReminders.js";

const router = express.Router();

router.get("/", getTodayReminders);

export default router;
