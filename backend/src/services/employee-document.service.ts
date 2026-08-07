import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { EmployeeDocument, DocumentCategory, Role } from "@prisma/client";
import employeeDocumentRepository from "../repositories/employee-document.repository";
import employeeRepository from "../repositories/employee.repository";
import { UploadDocumentMetaInput, UpdateDocumentMetaInput } from "../validators/employee-document.validator";

// ESM alternatives for __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const UPLOAD_ROOT = path.resolve(__dirname, "../../..", "uploads", "employee-documents");
export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const ALLOWED_MIME_TYPES = new Set<string>([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "text/plain",
]);

function ensureUploadDirsSync(): void {
  if (!fs.existsSync(UPLOAD_ROOT)) fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
}
ensureUploadDirsSync();

class EmployeeDocumentService {
  async uploadDocument(
    meta: UploadDocumentMetaInput,
    file: Express.Multer.File,
    uploadedById: string
  ): Promise<EmployeeDocument> {
    const employee = await employeeRepository.findById(meta.employeeId);
    if (!employee) throw new Error("Employee not found.");

    if (!file) throw new Error("File is required.");
    if (file.size > MAX_FILE_SIZE)
      throw new Error(`File exceeds maximum size of ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
    if (!ALLOWED_MIME_TYPES.has(file.mimetype))
      throw new Error(`File type '${file.mimetype}' is not allowed.`);

    const employeeDir = path.join(UPLOAD_ROOT, meta.employeeId);
    if (!fs.existsSync(employeeDir)) fs.mkdirSync(employeeDir, { recursive: true });

    const ext = path.extname(file.originalname || "").toLowerCase();
    const storedName = `${crypto.randomUUID()}${ext}`;
    const storedPath = path.join(employeeDir, storedName);
    fs.renameSync(file.path, storedPath);

    try {
      return await employeeDocumentRepository.create({
        employeeId: meta.employeeId,
        fileName: storedName,
        originalName: file.originalname,
        mimeType: file.mimetype,
        category: (meta.category as DocumentCategory) || "OTHER",
        size: file.size,
        storedPath,
        description: meta.description || undefined,
        uploadedById,
      });
    } catch (err) {
      if (fs.existsSync(storedPath)) {
        try {
          fs.unlinkSync(storedPath);
        } catch {
          /* noop */
        }
      }
      throw err;
    }
  }

  async getDocumentsByEmployee(
    employeeId: string,
    category?: DocumentCategory
  ): Promise<EmployeeDocument[]> {
    const employee = await employeeRepository.findById(employeeId);
    if (!employee) throw new Error("Employee not found.");
    return employeeDocumentRepository.findByEmployee(employeeId, category);
  }

  async getDocumentById(id: string): Promise<EmployeeDocument | null> {
    return employeeDocumentRepository.findById(id);
  }

  async resolvePathForDownload(id: string): Promise<{
    storedPath: string;
    contentType: string;
    downloadName: string;
    document: EmployeeDocument;
  }> {
    const doc = await employeeDocumentRepository.findById(id);
    if (!doc) throw new Error("Document not found.");
    if (!fs.existsSync(doc.storedPath)) throw new Error("File no longer exists on disk.");
    return {
      storedPath: doc.storedPath,
      contentType: doc.mimeType,
      downloadName: doc.originalName,
      document: doc,
    };
  }

  async updateDocumentMeta(
    id: string,
    payload: UpdateDocumentMetaInput
  ): Promise<EmployeeDocument> {
    const existing = await employeeDocumentRepository.findById(id);
    if (!existing) throw new Error("Document not found.");
    return employeeDocumentRepository.update(id, {
      ...(payload.category ? { category: payload.category } : {}),
      ...(payload.description !== undefined ? { description: payload.description } : {}),
    });
  }

  async deleteDocument(id: string): Promise<void> {
    const existing = await employeeDocumentRepository.findById(id);
    if (!existing) throw new Error("Document not found.");

    if (fs.existsSync(existing.storedPath)) {
      fs.unlinkSync(existing.storedPath);
    }

    await employeeDocumentRepository.delete(id);
  }

  canActOn(
    requesterRole: Role,
    requesterEmployeeId: string | undefined,
    documentEmployeeId: string
  ): boolean {
    if (requesterRole === "ADMIN" || requesterRole === "HR") return true;
    return Boolean(requesterEmployeeId && requesterEmployeeId === documentEmployeeId);
  }
}

export default new EmployeeDocumentService();
