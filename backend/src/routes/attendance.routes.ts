import { Router } from "express";
import attendanceController from "../controllers/attendance.controller";
import authenticate from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/", attendanceController.getAll);
router.post("/check-in", attendanceController.checkIn);
router.patch("/check-out", attendanceController.checkOut);
router.get("/today", attendanceController.getToday);
router.get("/history", attendanceController.getHistory);

export default router;
