    import { Router } from "express";
import organizationController from "../controllers/organization.controller";

const router = Router();

router.post("/", organizationController.create);

router.get("/", organizationController.getAll);

router.get("/:id", organizationController.getById);

export default router;