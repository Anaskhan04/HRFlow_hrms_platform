import { Request, Response } from "express";
import { Role } from "@prisma/client";

import organizationService from "../services/organization.service";
import {
  createOrganizationSchema,
  updateOrganizationSchema,
} from "../validators/organization.validator";
import { asyncHandler } from "../utils/asyncHandler";

class OrganizationController {
  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const data = createOrganizationSchema.parse(req.body);

    const organization = await organizationService.createOrganization(data);

    res.status(201).json({
      success: true,
      message: "Organization created successfully.",
      data: organization,
    });
  });

  getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const isPrivileged = req.user?.role === Role.ADMIN || req.user?.role === Role.HR;
    let data = await organizationService.getOrganizations();
    if (!isPrivileged && req.user?.organizationId) {
      data = data.filter(org => org.id === req.user?.organizationId);
    }

    res.json({
      success: true,
      data,
    });
  });

  getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const organization = await organizationService.getOrganizationById(
      req.params.id as string
    );

    if (!organization) {
      res.status(404).json({
        success: false,
        message: "Organization not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: organization,
    });
  });

  update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const existing = await organizationService.getOrganizationById(
      req.params.id as string
    );

    if (!existing) {
      res.status(404).json({
        success: false,
        message: "Organization not found.",
      });
      return;
    }

    const data = updateOrganizationSchema.parse(req.body);

    const organization = await organizationService.updateOrganization(
      req.params.id as string,
      data
    );

    res.status(200).json({
      success: true,
      message: "Organization updated successfully.",
      data: organization,
    });
  });

  remove = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const existing = await organizationService.getOrganizationById(
      req.params.id as string
    );

    if (!existing) {
      res.status(404).json({
        success: false,
        message: "Organization not found.",
      });
      return;
    }

    const organization = await organizationService.deactivateOrganization(
      req.params.id as string
    );

    res.status(200).json({
      success: true,
      message: "Organization deactivated successfully.",
      data: organization,
    });
  });
}

export default new OrganizationController();