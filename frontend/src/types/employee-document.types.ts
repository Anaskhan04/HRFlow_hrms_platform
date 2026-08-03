export type DocumentCategory =
  | "IDENTIFICATION"
  | "EDUCATION"
  | "EXPERIENCE"
  | "CONTRACT"
  | "PAYSLIP"
  | "TAX"
  | "MEDICAL"
  | "OTHER";

export interface EmployeeDocument {
  id: string;
  employeeId: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  category: DocumentCategory;
  size: number;
  storedPath: string;
  description?: string | null;
  uploadedById: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadDocumentPayload {
  employeeId: string;
  category?: DocumentCategory;
  description?: string;
  file: File;
}

export interface UpdateDocumentMetaPayload {
  category?: DocumentCategory;
  description?: string;
}

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  IDENTIFICATION: "Identification",
  EDUCATION:      "Education",
  EXPERIENCE:     "Experience",
  CONTRACT:       "Contract",
  PAYSLIP:        "Payslip",
  TAX:            "Tax",
  MEDICAL:        "Medical",
  OTHER:          "Other",
};
