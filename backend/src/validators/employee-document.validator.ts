import { z } from "zod";

export const documentCategoryEnum = z.enum([
  "IDENTIFICATION",
  "EDUCATION",
  "EXPERIENCE",
  "CONTRACT",
  "PAYSLIP",
  "TAX",
  "MEDICAL",
  "OTHER",
]);

export const uploadDocumentMetaSchema = z.object({
  employeeId: z.string().min(1, "employeeId is required."),
  category: documentCategoryEnum.default("OTHER"),
  description: z.string().max(500).optional(),
});

export const updateDocumentMetaSchema = z.object({
  category: documentCategoryEnum.optional(),
  description: z.string().max(500).optional(),
});

export type UploadDocumentMetaInput = z.infer<typeof uploadDocumentMetaSchema>;
export type UpdateDocumentMetaInput = z.infer<typeof updateDocumentMetaSchema>;
