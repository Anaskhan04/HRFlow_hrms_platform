import { Router } from "express";
import payrollController from "../controllers/payroll.controller";
import authenticate from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.post("/generate", payrollController.generate);
router.get("/", payrollController.getAll);
router.get("/:id", payrollController.getById);
router.patch("/:id/pay", payrollController.pay);

export default router;
