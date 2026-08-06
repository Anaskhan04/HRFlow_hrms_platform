import { Router } from "express";
import { Role } from "@prisma/client";
import authController from "../controllers/auth.controller";
import authenticate from "../middleware/auth.middleware";
import authorizeRole from "../middleware/role.middleware";

const router = Router();

router.post("/register", authenticate, authorizeRole(Role.ADMIN, Role.HR), authController.register);
router.post("/login", authController.login);

router.get("/me", authenticate, authController.getMe);
router.put("/profile", authenticate, authController.updateProfile);
router.put("/change-password", authenticate, authController.changePassword);

export default router;
