import { Payroll, PayrollStatus } from "@prisma/client";
import payrollRepository from "../repositories/payroll.repository";

class PayrollService {
  async generatePayroll(data: {
    employeeId: string;
    month: number;
    year: number;
    basicSalary?: number;
    allowances?: number;
    deductions?: number;
  }): Promise<Payroll> {
    const employee = await payrollRepository.findEmployeeById(data.employeeId);
    if (!employee) {
      throw new Error("Employee not found.");
    }

    const existingPayroll = await payrollRepository.findByEmployeeMonthYear(
      data.employeeId,
      data.month,
      data.year
    );

    if (existingPayroll) {
      throw new Error(
        "Payroll cannot be generated twice for the same month."
      );
    }

    const basicSalary = data.basicSalary ?? (employee.salary || 0);
    const allowances = data.allowances ?? 0;
    const deductions = data.deductions ?? 0;
    const netSalary = parseFloat(
      (basicSalary + allowances - deductions).toFixed(2)
    );

    return payrollRepository.create({
      employeeId: data.employeeId,
      month: data.month,
      year: data.year,
      basicSalary,
      allowances,
      deductions,
      netSalary,
      status: PayrollStatus.GENERATED,
      generatedAt: new Date(),
    });
  }

  async getPayrolls(): Promise<Payroll[]> {
    return payrollRepository.findAll();
  }

  async getAllPayrolls(params: {
    page?: number;
    limit?: number;
    search?: string;
    month?: number;
    year?: number;
    status?: any;
    employeeId?: string;
    sort?: string;
    order?: string;
  }): Promise<{
    payrolls: Payroll[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    const { payrolls, total } = await payrollRepository.findAllPaginated({
      skip,
      take: limit,
      search: params.search,
      month: params.month,
      year: params.year,
      status: params.status,
      employeeId: params.employeeId,
      sort: params.sort,
      order: params.order,
    });


    return {
      payrolls,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async getPayrollById(id: string): Promise<Payroll | null> {
    return payrollRepository.findById(id);
  }

  async updatePayroll(
    id: string,
    data: {
      basicSalary?: number;
      allowances?: number;
      deductions?: number;
      status?: PayrollStatus;
      month?: number;
      year?: number;
    }
  ): Promise<Payroll> {
    const payroll = await payrollRepository.findById(id);
    if (!payroll) {
      throw new Error("Payroll not found.");
    }

    const basicSalary = data.basicSalary ?? payroll.basicSalary;
    const allowances = data.allowances ?? payroll.allowances;
    const deductions = data.deductions ?? payroll.deductions;
    const netSalary = parseFloat((basicSalary + allowances - deductions).toFixed(2));

    const updateData: any = {
      basicSalary,
      allowances,
      deductions,
      netSalary,
    };
    if (data.status) updateData.status = data.status;
    if (data.month) updateData.month = data.month;
    if (data.year) updateData.year = data.year;

    return payrollRepository.update(id, updateData);
  }

  async deletePayroll(id: string): Promise<Payroll> {
    const payroll = await payrollRepository.findById(id);
    if (!payroll) {
      throw new Error("Payroll not found.");
    }
    return payrollRepository.delete(id);
  }

  async payPayroll(id: string): Promise<Payroll> {

    const payroll = await payrollRepository.findById(id);
    if (!payroll) {
      throw new Error("Payroll not found.");
    }

    if (payroll.status === PayrollStatus.PAID) {
      throw new Error("Payroll is already marked as PAID.");
    }

    return payrollRepository.update(id, {
      status: PayrollStatus.PAID,
      paidAt: new Date(),
    });
  }
}

export default new PayrollService();
