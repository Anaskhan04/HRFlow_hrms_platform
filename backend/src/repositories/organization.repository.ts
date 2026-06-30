import prisma from "../lib/prisma";

import { Prisma, Organization } from "@prisma/client";

class OrganizationRepository {
  async create(data: Prisma.OrganizationCreateInput): Promise<Organization> {
    return prisma.organization.create({
      data,
    });
  }

  async findById(id: string): Promise<Organization | null> {
    return prisma.organization.findUnique({
      where: { id },
    });
  }

  async findBySlug(slug: string): Promise<Organization | null> {
    return prisma.organization.findUnique({
      where: { slug },
    });
  }

  async findAll(): Promise<Organization[]> {
    return prisma.organization.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async update(
    id: string,
    data: Prisma.OrganizationUpdateInput
  ): Promise<Organization> {
    return prisma.organization.update({
      where: { id },
      data,
    });
  }

  async deactivate(id: string): Promise<Organization> {
    return prisma.organization.update({
      where: { id },
      data: {
        isActive: false,
      },
    });
  }
}

export default new OrganizationRepository();