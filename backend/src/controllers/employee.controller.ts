import { Request, Response } from "express";

import employeeService from "../services/employee.service";
import exportService from "../services/export.service";
import {
  createEmployeeSchema,
  updateEmployeeSchema,
} from "../validators/employee.validator";
import { asyncHandler } from "../utils/asyncHandler";
import { Role } from "@prisma/client";

class EmployeeController {
  create = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const data = createEmployeeSchema.parse(req.body);

    const employee = await employeeService.createEmployee(data);

    res.status(201).json({
      success: true,
      message: "Employee created successfully.",
      data: employee,
    });
  });

  getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query = { ...req.query };
    if (req.user?.organizationId) {
      query.organizationId = req.user.organizationId;
    }
    const result = await employeeService.getEmployees(query);

    const isPrivileged = req.user?.role === Role.ADMIN || req.user?.role === Role.HR;
    if (!isPrivileged) {
      result.employees = result.employees.map((emp) => {
        const { salary, ...rest } = emp;
        return rest as any;
      });
    }

    res.status(200).json({
      success: true,
      data: result,
      ...result,
    });
  });

  export = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    // Fetch employees with the exact same filters, but we might want all of them for export or limit to 1000
    const queryParams = { ...req.query, limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 1000 };
    if (req.user?.organizationId) {
      (queryParams as any).organizationId = req.user.organizationId;
    }
    const result = await employeeService.getEmployees(queryParams as any);
    const buffer = await exportService.exportEmployees(result.employees);

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=employees.xlsx");
    res.send(buffer);
  });

  getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const employee = await employeeService.getEmployeeById(
      req.params.id as string
    );

    if (!employee) {
      res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
      return;
    }

    let returnedEmployee = employee;
    const isPrivileged = req.user?.role === Role.ADMIN || req.user?.role === Role.HR;
    if (!isPrivileged && employee.id !== req.user?.employeeId) {
      const { salary, ...rest } = employee;
      returnedEmployee = rest as any;
    }

    res.status(200).json({
      success: true,
      data: returnedEmployee,
    });
  });

  update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const existingEmployee = await employeeService.getEmployeeById(
      req.params.id as string
    );

    if (!existingEmployee) {
      res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
      return;
    }

    const data = updateEmployeeSchema.parse(req.body);

    const employee = await employeeService.updateEmployee(
      req.params.id as string,
      data
    );

    res.status(200).json({
      success: true,
      message: "Employee updated successfully.",
      data: employee,
    });
  });

  delete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const existingEmployee = await employeeService.getEmployeeById(
      req.params.id as string
    );

    if (!existingEmployee) {
      res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
      return;
    }

    await employeeService.deleteEmployee(req.params.id as string);

    res.status(200).json({
      success: true,
      message: "Employee terminated successfully.",
    });
  });
}

export default new EmployeeController();
