import multer from "multer";
import { MAX_FILE_SIZE, ALLOWED_MIME_TYPES, UPLOAD_ROOT } from "../services/employee-document.service";
import os from "node:os";
import path from "node:path";
import fs from "node:fs";

const STAGING_DIR =
  process.env.UPLOAD_STAGING_DIR || path.join(UPLOAD_ROOT, "staging");

if (!fs.existsSync(STAGING_DIR)) {
  fs.mkdirSync(STAGING_DIR, { recursive: true });
}

export const uploadDocument = multer({
  dest: STAGING_DIR,
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.has(file.mimetype)) cb(null, true);
    else cb(new Error(`Disallowed file type: ${file.mimetype}`));
  },
});
