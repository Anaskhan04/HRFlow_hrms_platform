import { Router } from "express";
import { Role } from "@prisma/client";
import departmentController from "../controllers/department.controller";
import authenticate from "../middleware/auth.middleware";
import authorizeRole from "../middleware/role.middleware";

const router = Router();

router.use(authenticate);

router.post("/", authorizeRole(Role.ADMIN, Role.HR), departmentController.create);

router.get("/", departmentController.getAll);

router.get("/:id", departmentController.getById);

router.put("/:id", authorizeRole(Role.ADMIN, Role.HR), departmentController.update);

router.delete("/:id", authorizeRole(Role.ADMIN, Role.HR), departmentController.delete);

export default router;
