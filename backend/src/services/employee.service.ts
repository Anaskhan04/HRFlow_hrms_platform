import { Prisma, Employee } from "@prisma/client";
import employeeRepository from "../repositories/employee.repository";
import organizationRepository from "../repositories/organization.repository";

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

  async getEmployees(): Promise<Employee[]> {
    return employeeRepository.findAll();
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

    return employeeRepository.update(id, data);
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
