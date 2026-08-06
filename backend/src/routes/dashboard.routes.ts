import { Router } from "express";
import { Role } from "@prisma/client";
import dashboardController from "../controllers/dashboard.controller";
import authenticate from "../middleware/auth.middleware";
import authorizeRole from "../middleware/role.middleware";

const router = Router();

router.use(authenticate);
router.use(authorizeRole(Role.ADMIN, Role.HR, Role.MANAGER));

router.get("/summary", dashboardController.getSummary);
router.get("/dashboard/summary", dashboardController.getSummary);
router.get("/analytics", dashboardController.getAnalytics);
router.get("/dashboard/analytics", dashboardController.getAnalytics);

export default router;

