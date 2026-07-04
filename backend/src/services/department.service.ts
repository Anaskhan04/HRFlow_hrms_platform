import { Prisma, Department } from "@prisma/client";
import departmentRepository from "../repositories/department.repository";
import organizationRepository from "../repositories/organization.repository";

class DepartmentService {
  async createDepartment(
    data: Prisma.DepartmentUncheckedCreateInput | Prisma.DepartmentCreateInput
  ): Promise<Department> {
    // Check if organization exists before creating a department
    if ("organizationId" in data && data.organizationId) {
      const existingOrg = await organizationRepository.findById(
        data.organizationId as string
      );

      if (!existingOrg) {
        throw new Error("Organization not found.");
      }
    }

    // Prevent duplicate department names within the same organization
    if ("name" in data && data.name && "organizationId" in data && data.organizationId) {
      const existingDept = await departmentRepository.findByNameAndOrganization(
        data.name as string,
        data.organizationId as string
      );

      if (existingDept) {
        throw new Error("Department name already exists in this organization.");
      }
    }

    return departmentRepository.create(data);
  }

  async getDepartments(): Promise<Department[]> {
    return departmentRepository.findAll();
  }

  async getDepartmentById(id: string): Promise<Department | null> {
    return departmentRepository.findById(id);
  }

  async updateDepartment(
    id: string,
    data: Prisma.DepartmentUncheckedUpdateInput | Prisma.DepartmentUpdateInput
  ): Promise<Department> {
    const existingDepartment = await departmentRepository.findById(id);

    if (!existingDepartment) {
      throw new Error("Department not found.");
    }

    const targetName = data.name ? (data.name as string) : existingDepartment.name;
    const targetOrgId =
      "organizationId" in data && data.organizationId
        ? (data.organizationId as string)
        : existingDepartment.organizationId;

    if (
      "organizationId" in data &&
      data.organizationId &&
      data.organizationId !== existingDepartment.organizationId
    ) {
      const existingOrg = await organizationRepository.findById(targetOrgId);

      if (!existingOrg) {
        throw new Error("Organization not found.");
      }
    }

    if (
      (data.name && data.name !== existingDepartment.name) ||
      ("organizationId" in data &&
        data.organizationId &&
        data.organizationId !== existingDepartment.organizationId)
    ) {
      const existingDept = await departmentRepository.findByNameAndOrganization(
        targetName,
        targetOrgId
      );

      if (existingDept && existingDept.id !== id) {
        throw new Error("Department name already exists in this organization.");
      }
    }

    return departmentRepository.update(id, data);
  }

  async deleteDepartment(id: string): Promise<Department> {
    const existingDepartment = await departmentRepository.findById(id);

    if (!existingDepartment) {
      throw new Error("Department not found.");
    }

    return departmentRepository.delete(id);
  }
}

export default new DepartmentService();
