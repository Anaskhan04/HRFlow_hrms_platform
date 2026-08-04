import { Router } from "express";
import { Role } from "@prisma/client";
import payrollController from "../controllers/payroll.controller";
import authenticate from "../middleware/auth.middleware";
import authorizeRole from "../middleware/role.middleware";

const router = Router();

router.use(authenticate);

router.post("/generate", authorizeRole(Role.ADMIN, Role.HR), payrollController.generate);
router.get("/export", authorizeRole(Role.ADMIN, Role.HR), payrollController.export);
router.get("/", payrollController.getAll);
router.get("/:id", payrollController.getById);
router.put("/:id", authorizeRole(Role.ADMIN, Role.HR), payrollController.update);
router.delete("/:id", authorizeRole(Role.ADMIN, Role.HR), payrollController.delete);
router.patch("/:id/pay", authorizeRole(Role.ADMIN, Role.HR), payrollController.pay);

export default router;
