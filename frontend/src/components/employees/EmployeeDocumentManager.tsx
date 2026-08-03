import React, { useState } from "react";
import {
  UploadCloud,
  FileText,
  Download,
  Trash2,
  AlertCircle,
  Loader2,
  FileSpreadsheet,
  FileImage,
  File,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  useEmployeeDocuments,
  useUploadEmployeeDocument,
  useDeleteEmployeeDocument,
  useDownloadEmployeeDocument,
} from "../../hooks/useEmployeeDocuments";
import type { DocumentCategory } from "../../types";
import { DOCUMENT_CATEGORY_LABELS } from "../../types";

interface Props {
  employeeId: string;
  canManage?: boolean;
}

const formatBytes = (n: number): string => {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
};

const IconForMime = ({ mime }: { mime: string }) => {
  if (mime.startsWith("image/")) return <FileImage className="h-5 w-5" />;
  if (mime.includes("pdf")) return <FileText className="h-5 w-5" />;
  if (mime.includes("sheet") || mime.includes("excel")) return <FileSpreadsheet className="h-5 w-5" />;
  return <File className="h-5 w-5" />;
};

export const EmployeeDocumentManager: React.FC<Props> = ({ employeeId, canManage = false }) => {
  const { data: docs = [], isLoading, isError, error, refetch } = useEmployeeDocuments(employeeId);
  const uploadMutation = useUploadEmployeeDocument();
  const deleteMutation = useDeleteEmployeeDocument(employeeId);
  const downloadMutation = useDownloadEmployeeDocument();

  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<DocumentCategory>("OTHER");
  const [description, setDescription] = useState("");

  const resetForm = () => {
    setFile(null);
    setCategory("OTHER");
    setDescription("");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    try {
      await uploadMutation.mutateAsync({ employeeId, category, description, file });
      resetForm();
    } catch {
      /* surfaced via mutation state */
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5 text-indigo-600" />
          Employee Documents
        </CardTitle>
        <CardDescription>
          {canManage
            ? "Upload, preview, and manage documents for this employee."
            : "Documents uploaded for this employee."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {canManage && (
          <form
            onSubmit={onSubmit}
            className="grid gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-4 md:grid-cols-3"
          >
            <div className="space-y-2 md:col-span-3">
              <Label>Upload File (PDF, images, Office, max 10 MB)</Label>
              <Input
                type="file"
                accept="application/pdf,image/*,.doc,.docx,.xls,.xlsx,.txt"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              {file && (
                <p className="text-xs text-muted-foreground">
                  Selected: <span className="font-medium text-foreground">{file.name}</span> — {formatBytes(file.size)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {(Object.keys(DOCUMENT_CATEGORY_LABELS) as DocumentCategory[]).map((k) => (
                  <option key={k} value={k}>
                    {DOCUMENT_CATEGORY_LABELS[k]}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Description (optional)</Label>
              <Input
                type="text"
                value={description}
                maxLength={500}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Passport scan, August 2024 payslip, etc."
              />
            </div>

            <div className="flex items-end gap-3 md:col-span-3">
              <Button type="submit" disabled={!file || uploadMutation.isPending} className="gap-2">
                {uploadMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UploadCloud className="h-4 w-4" />
                )}
                {uploadMutation.isPending ? "Uploading…" : "Upload Document"}
              </Button>
              <Button type="button" variant="outline" disabled={!file} onClick={resetForm}>
                Clear
              </Button>
              {uploadMutation.error && (
                <div className="ml-auto flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  {(uploadMutation.error as Error)?.message || "Upload failed."}
                </div>
              )}
            </div>
          </form>
        )}

        <div>
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading documents…
            </div>
          )}
          {isError && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {error?.message || "Couldn't load documents."}
              <Button variant="outline" size="sm" className="ml-auto" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          )}

          {!isLoading && !isError && docs.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-8 text-center text-sm text-muted-foreground">
              No documents uploaded yet.
            </div>
          )}

          {docs.length > 0 && (
            <ul className="divide-y divide-slate-200 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800">
              {docs.map((d) => (
                <li key={d.id} className="flex items-center gap-3 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                    <IconForMime mime={d.mimeType} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{d.originalName}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {DOCUMENT_CATEGORY_LABELS[d.category]} · {formatBytes(d.size)} ·{" "}
                      {new Date(d.createdAt).toLocaleDateString()}
                      {d.description ? ` · ${d.description}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1"
                      onClick={() => downloadMutation.mutate({ id: d.id, fileName: d.originalName })}
                      disabled={downloadMutation.isPending}
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    {canManage && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-destructive hover:text-destructive"
                        onClick={() => {
                          if (confirm(`Delete document "${d.originalName}"? This cannot be undone.`))
                            deleteMutation.mutate(d.id);
                        }}
                        disabled={deleteMutation.isPending}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeDocumentManager;
