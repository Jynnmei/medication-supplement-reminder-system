import express from "express";
import { getAllLogs, updateLogs } from "../controllers/logs.js";

const router = express.Router();

router.get("/", getAllLogs);
router.patch("/:log_id", updateLogs);

export default router;
