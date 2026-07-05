import { Request, Response } from "express";

import departmentService from "../services/department.service";
import {
  createDepartmentSchema,
  updateDepartmentSchema,
} from "../validators/department.validator";
import { asyncHandler } from "../utils/asyncHandler";

class DepartmentController {
  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const data = createDepartmentSchema.parse(req.body);

    const department = await departmentService.createDepartment(data);

    res.status(201).json({
      success: true,
      message: "Department created successfully.",
      data: department,
    });
  });

  getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const departments = await departmentService.getDepartments();

    res.status(200).json({
      success: true,
      data: departments,
    });
  });

  getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const department = await departmentService.getDepartmentById(
      req.params.id as string
    );

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
  });

  update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const existingDepartment = await departmentService.getDepartmentById(
      req.params.id as string
    );

    if (!existingDepartment) {
      res.status(404).json({
        success: false,
        message: "Department not found.",
      });
      return;
    }

    const data = updateDepartmentSchema.parse(req.body);

    const department = await departmentService.updateDepartment(
      req.params.id as string,
      data
    );

    res.status(200).json({
      success: true,
      message: "Department updated successfully.",
      data: department,
    });
  });

  delete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const existingDepartment = await departmentService.getDepartmentById(
      req.params.id as string
    );

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
  });
}

export default new DepartmentController();
