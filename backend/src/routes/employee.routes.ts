import { Router } from "express";
import employeeController from "../controllers/employee.controller";

const router = Router();

router.post("/", employeeController.create);

router.get("/", employeeController.getAll);

router.get("/:id", employeeController.getById);

router.put("/:id", employeeController.update);

router.patch("/:id", employeeController.update);

router.delete("/:id", employeeController.delete);

export default router;
