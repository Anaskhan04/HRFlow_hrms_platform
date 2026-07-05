import { Request, Response } from "express";

import organizationService from "../services/organization.service";
import { createOrganizationSchema } from "../validators/organization.validator";
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
    console.log("Controller reached");

    const data = await organizationService.getOrganizations();

    console.log(data);

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
}

export default new OrganizationController();