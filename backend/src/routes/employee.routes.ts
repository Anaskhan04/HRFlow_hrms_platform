import { Router } from "express";
import { Role } from "@prisma/client";

import employeeController from "../controllers/employee.controller";
import authenticate from "../middleware/auth.middleware";
import authorizeRole from "../middleware/role.middleware";
const router = Router();

router.use(authenticate);

router.post("/", authorizeRole(Role.ADMIN, Role.HR), employeeController.create);

router.get("/export", authorizeRole(Role.ADMIN, Role.HR), employeeController.export);

router.get("/", employeeController.getAll);

router.get("/:id", employeeController.getById);

router.put("/:id", authorizeRole(Role.ADMIN, Role.HR), employeeController.update);

router.delete("/:id", authorizeRole(Role.ADMIN, Role.HR), employeeController.delete);

export default router;
