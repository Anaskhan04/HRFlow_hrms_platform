import { Router } from "express";
import dashboardController from "../controllers/dashboard.controller";
import authenticate from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/summary", dashboardController.getSummary);
router.get("/dashboard/summary", dashboardController.getSummary);
router.get("/analytics", dashboardController.getAnalytics);
router.get("/dashboard/analytics", dashboardController.getAnalytics);

export default router;

