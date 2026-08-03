import { Router } from "express";
import { Role } from "@prisma/client";
import organizationController from "../controllers/organization.controller";
import authenticate from "../middleware/auth.middleware";
import authorizeRole from "../middleware/role.middleware";

const router = Router();

router.use(authenticate);

router.post("/", authorizeRole(Role.ADMIN, Role.HR), organizationController.create);

router.get("/", organizationController.getAll);

router.get("/:id", organizationController.getById);

router.put("/:id", authorizeRole(Role.ADMIN, Role.HR), organizationController.update);
router.patch("/:id", authorizeRole(Role.ADMIN, Role.HR), organizationController.update);

router.delete("/:id", authorizeRole(Role.ADMIN), organizationController.remove);

export default router;
