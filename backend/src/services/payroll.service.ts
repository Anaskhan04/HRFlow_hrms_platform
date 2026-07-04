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

  async getPayrollById(id: string): Promise<Payroll | null> {
    return payrollRepository.findById(id);
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
