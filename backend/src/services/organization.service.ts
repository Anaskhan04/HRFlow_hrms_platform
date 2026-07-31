import { Prisma, Organization } from "@prisma/client";
import organizationRepository from "../repositories/organization.repository";

class OrganizationService {
  async createOrganization(
    data: Prisma.OrganizationCreateInput
  ): Promise<Organization> {
    // Check if slug already exists
    const existingBySlug = await organizationRepository.findBySlug(data.slug);
    if (existingBySlug) {
      throw new Error("Organization slug already exists.");
    }

    // Check if email already exists (Organization.email is @unique in schema)
    const existingByEmail = await organizationRepository.findByEmail(data.email);
    if (existingByEmail) {
      throw new Error("Organization email already exists.");
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
    // Ensure the target record exists first (for consistent not-found messaging)
    const current = await organizationRepository.findById(id);
    if (!current) {
      throw new Error("Organization not found.");
    }

    // Slug uniqueness check: if slug is being updated, validate it does not
    // collide with any OTHER organization (i.e., allow "no change" to same slug).
    if (data.slug && typeof data.slug === "string") {
      const slugConflict = await organizationRepository.findBySlug(data.slug);
      if (slugConflict && slugConflict.id !== id) {
        throw new Error("Organization slug already exists.");
      }
    }

    // Email uniqueness check: same self-collision pattern as slug.
    if (data.email && typeof data.email === "string") {
      const emailConflict = await organizationRepository.findByEmail(data.email);
      if (emailConflict && emailConflict.id !== id) {
        throw new Error("Organization email already exists.");
      }
    }

    return organizationRepository.update(id, data);
  }

  async deactivateOrganization(id: string): Promise<Organization> {
    const current = await organizationRepository.findById(id);
    if (!current) {
      throw new Error("Organization not found.");
    }
    if (!current.isActive) {
      throw new Error("Organization is already deactivated.");
    }
    return organizationRepository.deactivate(id);
  }
}

export default new OrganizationService();