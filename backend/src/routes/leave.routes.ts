import { Router } from "express";
import leaveController from "../controllers/leave.controller";
import authenticate from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.post("/", leaveController.create);

router.get("/", leaveController.getAll);

router.post("/apply", leaveController.apply);

router.get("/types", leaveController.getTypes);
router.get("/my-leaves", leaveController.getMyLeaves);

router.patch("/:id/approve", leaveController.approve);

router.patch("/:id/reject", leaveController.reject);

router.patch("/:id/cancel", leaveController.cancel);

router.get("/:id", leaveController.getById);

router.put("/:id", leaveController.update);

router.patch("/:id", leaveController.update);

router.delete("/:id", leaveController.delete);

export default router;
