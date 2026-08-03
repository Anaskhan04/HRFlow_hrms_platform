import { Router } from "express";
import { Role } from "@prisma/client";
import notificationController from "../controllers/notification.controller";
import authenticate from "../middleware/auth.middleware";
import authorizeRole from "../middleware/role.middleware";

const router = Router();
router.use(authenticate);

router.get("/", notificationController.list);
router.get("/unread-count", notificationController.unreadCount);
router.get("/:id", notificationController.getById);
router.patch("/:id/read", notificationController.markRead);
router.patch("/read-all", notificationController.markAllRead);
router.delete("/:id", notificationController.remove);
router.delete("/", notificationController.clearAll);

router.post("/", authorizeRole(Role.ADMIN, Role.HR), notificationController.create);
router.patch("/:id", authorizeRole(Role.ADMIN, Role.HR), notificationController.update);

export default router;
