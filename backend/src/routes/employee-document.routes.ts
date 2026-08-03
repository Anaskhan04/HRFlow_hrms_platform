import { Router } from "express";
import { Role } from "@prisma/client";
import employeeDocumentController from "../controllers/employee-document.controller";
import authenticate from "../middleware/auth.middleware";
import authorizeRole from "../middleware/role.middleware";
import { uploadDocument } from "../middleware/upload.middleware";

const router = Router();
router.use(authenticate);

router.post(
  "/",
  authorizeRole(Role.ADMIN, Role.HR, Role.EMPLOYEE),
  uploadDocument.single("file"),
  employeeDocumentController.upload
);

router.get(
  "/employee/:employeeId",
  authorizeRole(Role.ADMIN, Role.HR, Role.EMPLOYEE),
  employeeDocumentController.listByEmployee
);

router.get(
  "/:id/download",
  authorizeRole(Role.ADMIN, Role.HR, Role.EMPLOYEE),
  employeeDocumentController.download
);

router.get(
  "/:id",
  authorizeRole(Role.ADMIN, Role.HR, Role.EMPLOYEE),
  employeeDocumentController.getById
);

router.patch(
  "/:id",
  authorizeRole(Role.ADMIN, Role.HR),
  employeeDocumentController.updateMeta
);

router.delete(
  "/:id",
  authorizeRole(Role.ADMIN, Role.HR, Role.EMPLOYEE),
  employeeDocumentController.remove
);

export default router;
