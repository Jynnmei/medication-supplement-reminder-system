import express from "express";
import {
  createMedicine,
  deleteMedicineById,
  getAllMedicines,
  updateMedicine,
} from "../controllers/medicines.js";

const router = express.Router();

router.get("/", getAllMedicines);
router.put("/", createMedicine);
router.patch("/:id", updateMedicine);
router.delete("/:id", deleteMedicineById);

export default router;
