import { Request, Response, NextFunction } from "express";

import organizationService from "../services/organization.service";
import { createOrganizationSchema } from "../validators/organization.validator";

class OrganizationController {
  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = createOrganizationSchema.parse(req.body);

      const organization =
        await organizationService.createOrganization(data);

      res.status(201).json({
        success: true,
        message: "Organization created successfully.",
        data: organization,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const organizations =
        await organizationService.getOrganizations();

      res.status(200).json({
        success: true,
        data: organizations,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const organization =
        await organizationService.getOrganizationById(req.params.id as string);

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
    } catch (error) {
      next(error);
    }
  }
}

export default new OrganizationController();