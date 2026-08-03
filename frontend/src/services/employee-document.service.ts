import apiClient from "./api.client";
import type {
  EmployeeDocument,
  DocumentCategory,
  UpdateDocumentMetaPayload,
} from "../types";

export const employeeDocumentService = {
  upload: async (payload: {
    employeeId: string;
    category?: DocumentCategory;
    description?: string;
    file: File;
  }): Promise<EmployeeDocument> => {
    const form = new FormData();
    form.append("employeeId", payload.employeeId);
    if (payload.category) form.append("category", payload.category);
    if (payload.description) form.append("description", payload.description);
    form.append("file", payload.file);

    const response = await apiClient.post<{ success: boolean; data: EmployeeDocument }>(
      "/employee-documents",
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60_000,
      }
    );
    return response.data.data;
  },

  listByEmployee: async (
    employeeId: string,
    category?: DocumentCategory
  ): Promise<EmployeeDocument[]> => {
    const params: Record<string, string> = {};
    if (category) params.category = category;
    const response = await apiClient.get<{ success: boolean; data: EmployeeDocument[] }>(
      `/employee-documents/employee/${employeeId}`,
      { params }
    );
    return response.data.data || [];
  },

  getById: async (id: string): Promise<EmployeeDocument> => {
    const response = await apiClient.get<{ success: boolean; data: EmployeeDocument }>(
      `/employee-documents/${id}`
    );
    return response.data.data;
  },

  getDownloadUrl: (id: string): string => {
    const base = (import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1").replace(/\/$/, "");
    return `${base}/employee-documents/${id}/download`;
  },

  download: async (id: string, fileName: string): Promise<void> => {
    const response = await apiClient.get(`/employee-documents/${id}/download`, {
      responseType: "blob",
      timeout: 120_000,
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },

  updateMeta: async (
    id: string,
    payload: UpdateDocumentMetaPayload
  ): Promise<EmployeeDocument> => {
    const response = await apiClient.patch<{ success: boolean; data: EmployeeDocument }>(
      `/employee-documents/${id}`,
      payload
    );
    return response.data.data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/employee-documents/${id}`);
  },
};

export default employeeDocumentService;
