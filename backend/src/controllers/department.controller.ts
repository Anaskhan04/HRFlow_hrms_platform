import { Request, Response, NextFunction } from "express";

import departmentService from "../services/department.service";
import {
  createDepartmentSchema,
  updateDepartmentSchema,
} from "../validators/department.validator";

class DepartmentController {
  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = createDepartmentSchema.parse(req.body);

      const department =
        await departmentService.createDepartment(data);

      res.status(201).json({
        success: true,
        message: "Department created successfully.",
        data: department,
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
      const departments =
        await departmentService.getDepartments();

      res.status(200).json({
        success: true,
        data: departments,
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
      const department =
        await departmentService.getDepartmentById(req.params.id as string);

      if (!department) {
        res.status(404).json({
          success: false,
          message: "Department not found.",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: department,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const existingDepartment =
        await departmentService.getDepartmentById(req.params.id as string);

      if (!existingDepartment) {
        res.status(404).json({
          success: false,
          message: "Department not found.",
        });
        return;
      }

      const data = updateDepartmentSchema.parse(req.body);

      const department =
        await departmentService.updateDepartment(req.params.id as string, data);

      res.status(200).json({
        success: true,
        message: "Department updated successfully.",
        data: department,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const existingDepartment =
        await departmentService.getDepartmentById(req.params.id as string);

      if (!existingDepartment) {
        res.status(404).json({
          success: false,
          message: "Department not found.",
        });
        return;
      }

      await departmentService.deleteDepartment(req.params.id as string);

      res.status(200).json({
        success: true,
        message: "Department deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new DepartmentController();
