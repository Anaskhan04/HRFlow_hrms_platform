import { Prisma, Employee, EmployeeStatus } from "@prisma/client";
import employeeRepository, {
  EmployeeQueryParams,
} from "../repositories/employee.repository";
import organizationRepository from "../repositories/organization.repository";
import authRepository from "../repositories/auth.repository";
import departmentRepository from "../repositories/department.repository";

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
    const reqDepartmentId = (data as any).departmentId;
    const reqOrganizationId = (data as any).organizationId;

    if (reqDepartmentId && reqOrganizationId) {
      const department = await departmentRepository.findById(reqDepartmentId as string);
      if (!department) {
        throw new Error("Department not found.");
      }
      if (department.organizationId !== reqOrganizationId) {
        throw new Error("Department does not belong to the specified organization.");
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

    const resultingOrganizationId = ((data as any).organizationId as string) || existingEmployee.organizationId;
    const resultingDepartmentId = (data as any).departmentId !== undefined ? ((data as any).departmentId as string | null) : existingEmployee.departmentId;

    if (resultingDepartmentId) {
      const department = await departmentRepository.findById(resultingDepartmentId);
      if (!department) {
        throw new Error("Department not found.");
      }
      if (department.organizationId !== resultingOrganizationId) {
        throw new Error("Department does not belong to the specified organization.");
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

    // Soft-deactivate: preserve all historical data (payroll, attendance, leave,
    // documents, User record) by terminating rather than hard-deleting.
    const terminated = await employeeRepository.update(id, {
      status: EmployeeStatus.TERMINATED,
    });

    // Deactivate the linked User account so the employee cannot log in.
    await authRepository.updateIsActiveByEmployeeId(id, false);

    return terminated;
  }
}

export default new EmployeeService();
