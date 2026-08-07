import { Request, Response } from "express";
import fs from "node:fs";
import { Role } from "@prisma/client";
import employeeDocumentService from "../services/employee-document.service";
import {
  uploadDocumentMetaSchema,
  updateDocumentMetaSchema,
} from "../validators/employee-document.validator";
import { asyncHandler } from "../utils/asyncHandler";

class EmployeeDocumentController {
  upload = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const file = req.file;
    if (!file) {
      res.status(400).json({ success: false, message: "File field 'file' is required." });
      return;
    }

    const cleanupTempFile = () => {
      if (file && file.path && fs.existsSync(file.path)) {
        try {
          fs.unlinkSync(file.path);
        } catch {
          /* noop */
        }
      }
    };

    try {
      const meta = uploadDocumentMetaSchema.parse(req.body);
      const requester = req.user!;

      if (requester.role !== Role.ADMIN && requester.role !== Role.HR) {
        if (!requester.employeeId || requester.employeeId !== meta.employeeId) {
          cleanupTempFile();
          res.status(403).json({ success: false, message: "Forbidden: you may only upload documents for yourself." });
          return;
        }
      }

      const document = await employeeDocumentService.uploadDocument(
        meta,
        file,
        requester.userId
      );

      res.status(201).json({
        success: true,
        message: "Document uploaded successfully.",
        data: document,
      });
    } catch (error) {
      cleanupTempFile();
      throw error;
    }
  });

  listByEmployee = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const employeeId = req.params.employeeId as string;
    const requester = req.user!;
    const category = (req.query.category as string | undefined) as any;

    if (!employeeDocumentService.canActOn(requester.role, requester.employeeId, employeeId)) {
      res.status(403).json({ success: false, message: "Forbidden: you cannot view this employee's documents." });
      return;
    }

    const docs = await employeeDocumentService.getDocumentsByEmployee(employeeId, category);
    res.json({ success: true, data: docs });
  });

  getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const doc = await employeeDocumentService.getDocumentById(req.params.id as string);
    if (!doc) {
      res.status(404).json({ success: false, message: "Document not found." });
      return;
    }
    const requester = req.user!;
    if (!employeeDocumentService.canActOn(requester.role, requester.employeeId, doc.employeeId)) {
      res.status(403).json({ success: false, message: "Forbidden." });
      return;
    }
    res.json({ success: true, data: doc });
  });

  download = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const meta = await employeeDocumentService.resolvePathForDownload(req.params.id as string);
    const requester = req.user!;
    if (!employeeDocumentService.canActOn(requester.role, requester.employeeId, meta.document.employeeId)) {
      res.status(403).json({ success: false, message: "Forbidden." });
      return;
    }
    res.setHeader("Content-Type", meta.contentType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(meta.downloadName)}"`
    );
    res.sendFile(meta.storedPath);
  });

  updateMeta = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const doc = await employeeDocumentService.getDocumentById(req.params.id as string);
    if (!doc) {
      res.status(404).json({ success: false, message: "Document not found." });
      return;
    }
    const requester = req.user!;
    if (requester.role !== Role.ADMIN && requester.role !== Role.HR) {
      res.status(403).json({ success: false, message: "Forbidden: only ADMIN or HR may edit document metadata." });
      return;
    }
    const payload = updateDocumentMetaSchema.parse(req.body);
    const updated = await employeeDocumentService.updateDocumentMeta(doc.id, payload);
    res.json({ success: true, message: "Document metadata updated.", data: updated });
  });

  remove = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const doc = await employeeDocumentService.getDocumentById(req.params.id as string);
    if (!doc) {
      res.status(404).json({ success: false, message: "Document not found." });
      return;
    }
    const requester = req.user!;
    if (requester.role !== Role.ADMIN && requester.role !== Role.HR) {
      if (!requester.employeeId || requester.employeeId !== doc.employeeId) {
        res.status(403).json({ success: false, message: "Forbidden: you cannot delete another employee's document." });
        return;
      }
    }
    await employeeDocumentService.deleteDocument(doc.id);
    res.json({ success: true, message: "Document deleted successfully." });
  });
}

export default new EmployeeDocumentController();
