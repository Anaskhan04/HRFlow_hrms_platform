import { Prisma, Organization } from "@prisma/client";
import organizationRepository from "../repositories/organization.repository";

class OrganizationService {
  async createOrganization(
    data: Prisma.OrganizationCreateInput
  ): Promise<Organization> {
    // Check if slug already exists
    const existingOrganization = await organizationRepository.findBySlug(
      data.slug
    );

    if (existingOrganization) {
      throw new Error("Organization slug already exists.");
    }

    return organizationRepository.create(data);
  }

  async getOrganizations(): Promise<Organization[]> {
    return organizationRepository.findAll();
  }

  async getOrganizationById(id: string): Promise<Organization | null> {
    return organizationRepository.findById(id);
  }

  async updateOrganization(
    id: string,
    data: Prisma.OrganizationUpdateInput
  ): Promise<Organization> {
    return organizationRepository.update(id, data);
  }

  async deactivateOrganization(id: string): Promise<Organization> {
    return organizationRepository.deactivate(id);
  }
}

export default new OrganizationService();