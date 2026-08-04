import { Router } from "express";
import { Role } from "@prisma/client";
import leaveController from "../controllers/leave.controller";
import authenticate from "../middleware/auth.middleware";
import authorizeRole from "../middleware/role.middleware";

const router = Router();

router.use(authenticate);

router.post("/", authorizeRole(Role.ADMIN, Role.HR), leaveController.create);

router.get("/export", authorizeRole(Role.ADMIN, Role.HR), leaveController.export);

router.get("/", authorizeRole(Role.ADMIN, Role.HR, Role.MANAGER), leaveController.getAll);

router.post("/apply", leaveController.apply);

router.get("/types", leaveController.getTypes);
router.get("/my-leaves", leaveController.getMyLeaves);

router.get("/balances", leaveController.getBalances);
router.get("/balances/:employeeId", leaveController.getBalances);

router.patch("/:id/approve", authorizeRole(Role.ADMIN, Role.HR, Role.MANAGER), leaveController.approve);

router.patch("/:id/reject", authorizeRole(Role.ADMIN, Role.HR, Role.MANAGER), leaveController.reject);

router.patch("/:id/cancel", leaveController.cancel);

router.get("/:id", leaveController.getById);

router.put("/:id", authorizeRole(Role.ADMIN, Role.HR), leaveController.update);

router.delete("/:id", authorizeRole(Role.ADMIN, Role.HR), leaveController.delete);

export default router;
