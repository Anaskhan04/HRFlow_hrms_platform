import { Prisma, Employee, EmployeeStatus } from "@prisma/client";
import employeeRepository, {
  EmployeeQueryParams,
} from "../repositories/employee.repository";
import organizationRepository from "../repositories/organization.repository";
import authRepository from "../repositories/auth.repository";

class EmployeeService {
  async createEmployee(
    data: Prisma.EmployeeUncheckedCreateInput | Prisma.EmployeeCreateInput
  ): Promise<Employee> {
    // Check if employee code already exists
    const existingCode = await employeeRepository.findByEmployeeCode(
      data.employeeCode
    );

    if (existingCode) {
      throw new Error("Employee code already exists.");
    }

    // Check if email already exists
    const existingEmail = await employeeRepository.findByEmail(
      data.email
    );

    if (existingEmail) {
      throw new Error("Employee email already exists.");
    }

    // Check if organization exists if organizationId is provided
    if ("organizationId" in data && data.organizationId) {
      const existingOrg = await organizationRepository.findById(
        data.organizationId as string
      );

      if (!existingOrg) {
        throw new Error("Organization not found.");
      }
    }

    return employeeRepository.create(data);
  }

  async getEmployees(params: EmployeeQueryParams = {}) {
    return employeeRepository.findManyWithPagination(params);
  }

  async getEmployeeById(id: string): Promise<Employee | null> {
    return employeeRepository.findById(id);
  }

  async updateEmployee(
    id: string,
    data: Prisma.EmployeeUncheckedUpdateInput | Prisma.EmployeeUpdateInput
  ): Promise<Employee> {
    const existingEmployee = await employeeRepository.findById(id);

    if (!existingEmployee) {
      throw new Error("Employee not found.");
    }

    if (data.employeeCode && data.employeeCode !== existingEmployee.employeeCode) {
      const existingCode = await employeeRepository.findByEmployeeCode(
        data.employeeCode as string
      );

      if (existingCode) {
        throw new Error("Employee code already exists.");
      }
    }

    if (data.email && data.email !== existingEmployee.email) {
      const existingEmail = await employeeRepository.findByEmail(
        data.email as string
      );

      if (existingEmail) {
        throw new Error("Employee email already exists.");
      }
    }

    if ("organizationId" in data && data.organizationId && data.organizationId !== existingEmployee.organizationId) {
      const existingOrg = await organizationRepository.findById(
        data.organizationId as string
      );

      if (!existingOrg) {
        throw new Error("Organization not found.");
      }
    }

    const updatedEmployee = await employeeRepository.update(id, data);

    const statusVal = data.status as any;
    if (
      statusVal &&
      (statusVal === EmployeeStatus.INACTIVE ||
        statusVal === EmployeeStatus.TERMINATED ||
        statusVal === "INACTIVE" ||
        statusVal === "TERMINATED" ||
        statusVal.set === EmployeeStatus.INACTIVE ||
        statusVal.set === EmployeeStatus.TERMINATED ||
        statusVal.set === "INACTIVE" ||
        statusVal.set === "TERMINATED")
    ) {
      await authRepository.updateIsActiveByEmployeeId(id, false);
    }

    return updatedEmployee;
  }

  async deleteEmployee(id: string): Promise<Employee> {
    const existingEmployee = await employeeRepository.findById(id);

    if (!existingEmployee) {
      throw new Error("Employee not found.");
    }

    return employeeRepository.delete(id);
  }
}

export default new EmployeeService();
