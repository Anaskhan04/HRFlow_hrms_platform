import { Router } from "express";
import departmentController from "../controllers/department.controller";

const router = Router();

router.post("/", departmentController.create);

router.get("/", departmentController.getAll);

router.get("/:id", departmentController.getById);

router.patch("/:id", departmentController.update);

router.put("/:id", departmentController.update);

router.delete("/:id", departmentController.delete);

export default router;
