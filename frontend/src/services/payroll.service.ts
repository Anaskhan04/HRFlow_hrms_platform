import apiClient from "./api.client";
import type {
  PayrollRecord,
  GeneratePayrollInput,
  UpdatePayrollInput,
  PayrollQueryParams,
  PaginatedPayrolls,
} from "../types";

export const payrollService = {
  getPayrollList: async (
    params: PayrollQueryParams = {}
  ): Promise<PaginatedPayrolls> => {
    let allRecords: PayrollRecord[] = [];

    const response = await apiClient.get<any>("/payroll", {
      params: {
        search: params.search,
        month: params.month !== "ALL" ? params.month : undefined,
        year: params.year !== "ALL" ? params.year : undefined,
        status: params.status !== "ALL" ? params.status : undefined,
        employeeId: params.employeeId,
        page: params.page,
        limit: params.limit,
        sort: params.sort,
        order: params.order,
      },
    });

    if (response.data?.data?.payrolls) {
      return response.data.data;
    } else if (Array.isArray(response.data?.data)) {
      allRecords = response.data.data;
    }

    // Client-side filtering & pagination fallback
    let filtered = [...allRecords];

    if (params.search) {
      const q = params.search.toLowerCase().trim();
      filtered = filtered.filter((r) => {
        const name = `${r.employee?.firstName || ""} ${r.employee?.lastName || ""}`.toLowerCase();
        const code = (r.employee?.employeeCode || "").toLowerCase();
        const email = (r.employee?.email || "").toLowerCase();
        return name.includes(q) || code.includes(q) || email.includes(q);
      });
    }

    if (params.month && params.month !== "ALL") {
      filtered = filtered.filter((r) => r.month === Number(params.month));
    }

    if (params.year && params.year !== "ALL") {
      filtered = filtered.filter((r) => r.year === Number(params.year));
    }

    if (params.status && params.status !== "ALL") {
      filtered = filtered.filter((r) => r.status === params.status);
    }

    // Sorting
    const sortField = params.sort || "createdAt";
    const sortOrder = params.order || "desc";
    filtered.sort((a, b) => {
      let aVal: any = (a as any)[sortField];
      let bVal: any = (b as any)[sortField];
      if (sortField === "yearMonth") {
        aVal = a.year * 100 + a.month;
        bVal = b.year * 100 + b.month;
      }
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    const page = params.page || 1;
    const limit = params.limit || 10;
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return {
      payrolls: paginated,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  },

  getPayrollById: async (id: string): Promise<PayrollRecord> => {
    const response = await apiClient.get<{ success: boolean; data: PayrollRecord }>(
      `/payroll/${id}`
    );
    return response.data.data;
  },

  generatePayroll: async (data: GeneratePayrollInput): Promise<PayrollRecord> => {
    const response = await apiClient.post<{ success: boolean; data: PayrollRecord }>(
      "/payroll/generate",
      data
    );
    return response.data.data;
  },

  updatePayroll: async (
    id: string,
    data: UpdatePayrollInput
  ): Promise<PayrollRecord> => {
    const response = await apiClient.put<{ success: boolean; data: PayrollRecord }>(
      `/payroll/${id}`,
      data
    );
    return response.data.data;
  },

  deletePayroll: async (id: string): Promise<void> => {
    await apiClient.delete(`/payroll/${id}`);
  },

  payPayroll: async (id: string): Promise<PayrollRecord> => {
    const response = await apiClient.patch<{ success: boolean; data: PayrollRecord }>(
      `/payroll/${id}/pay`
    );
    return response.data.data;
  },
};
