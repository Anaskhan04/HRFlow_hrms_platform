import { Router } from "express";
import { Role } from "@prisma/client";

import employeeController from "../controllers/employee.controller";
import authenticate from "../middleware/auth.middleware";
import authorize from "../middleware/role.middleware";
const router = Router();

router.post("/", employeeController.create);

router.get("/", employeeController.getAll);

router.get("/:id", employeeController.getById);

router.put("/:id", employeeController.update);

router.patch("/:id", employeeController.update);

router.delete("/:id", employeeController.delete);

export default router;
