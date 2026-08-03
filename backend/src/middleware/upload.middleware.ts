import multer from "multer";
import { MAX_FILE_SIZE, ALLOWED_MIME_TYPES } from "../services/employee-document.service";
import os from "node:os";

const STAGING_DIR =
  process.env.UPLOAD_STAGING_DIR || os.tmpdir();

export const uploadDocument = multer({
  dest: STAGING_DIR,
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.has(file.mimetype)) cb(null, true);
    else cb(new Error(`Disallowed file type: ${file.mimetype}`));
  },
});
