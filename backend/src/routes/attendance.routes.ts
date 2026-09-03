import { Router } from "express";
import attendanceController from "../controllers/attendance.controller";
import authenticate from "../middleware/auth.middleware";
import authorizeRole from "../middleware/role.middleware";
import { Role } from "@prisma/client";

const router = Router();

router.use(authenticate);

router.get("/", attendanceController.getAll);
router.post("/check-in", attendanceController.checkIn);
router.patch("/check-out", attendanceController.checkOut);
router.get("/export", authorizeRole(Role.ADMIN, Role.HR), attendanceController.export);
router.get("/today", attendanceController.getToday);
router.get("/history", attendanceController.getHistory);

export default router;
