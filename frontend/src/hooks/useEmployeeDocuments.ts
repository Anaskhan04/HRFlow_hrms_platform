import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import employeeDocumentService from "../services/employee-document.service";
import type {
  EmployeeDocument,
  DocumentCategory,
  UpdateDocumentMetaPayload,
} from "../types";

export const useEmployeeDocuments = (employeeId: string, category?: DocumentCategory) => {
  return useQuery<EmployeeDocument[], Error>({
    queryKey: ["employee-documents", employeeId, category],
    queryFn: () => employeeDocumentService.listByEmployee(employeeId, category),
    enabled: !!employeeId,
  });
};

export const useUploadEmployeeDocument = () => {
  const qc = useQueryClient();
  return useMutation<
    EmployeeDocument,
    Error,
    Parameters<typeof employeeDocumentService.upload>[0]
  >({
    mutationFn: employeeDocumentService.upload,
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["employee-documents", vars.employeeId] });
      qc.invalidateQueries({ queryKey: ["employee-documents", vars.employeeId, vars.category] });
    },
  });
};

export const useUpdateEmployeeDocumentMeta = (employeeId: string) => {
  const qc = useQueryClient();
  return useMutation<
    EmployeeDocument,
    Error,
    { id: string; payload: UpdateDocumentMetaPayload }
  >({
    mutationFn: ({ id, payload }) => employeeDocumentService.updateMeta(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["employee-documents", employeeId] });
    },
  });
};

export const useDeleteEmployeeDocument = (employeeId: string) => {
  const qc = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: employeeDocumentService.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["employee-documents", employeeId] });
    },
  });
};

export const useDownloadEmployeeDocument = () => {
  return useMutation<void, Error, { id: string; fileName: string }>({
    mutationFn: ({ id, fileName }) => employeeDocumentService.download(id, fileName),
  });
};
