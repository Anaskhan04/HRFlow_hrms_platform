import { Request, Response } from "express";
import payrollService from "../services/payroll.service";
import { generatePayrollSchema } from "../validators/payroll.validator";
import { asyncHandler } from "../utils/asyncHandler";

class PayrollController {
  generate = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const data = generatePayrollSchema.parse(req.body);

    const payroll = await payrollService.generatePayroll(data);

    res.status(201).json({
      success: true,
      message: "Payroll generated successfully.",
      data: payroll,
    });
  });

  getAll = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
    const search = req.query.search as string;
    const month = req.query.month && req.query.month !== "ALL" ? parseInt(req.query.month as string, 10) : undefined;
    const year = req.query.year && req.query.year !== "ALL" ? parseInt(req.query.year as string, 10) : undefined;
    const status = req.query.status as any;
    const employeeId = req.query.employeeId as string;
    const sort = req.query.sort as string;
    const order = req.query.order as string;

    const result = await payrollService.getAllPayrolls({
      page,
      limit,
      search,
      month,
      year,
      status,
      employeeId,
      sort,
      order,
    });


    res.status(200).json({
      success: true,
      data: result,
    });
  });

  update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const payroll = await payrollService.updatePayroll(
      req.params.id as string,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Payroll updated successfully.",
      data: payroll,
    });
  });

  delete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await payrollService.deletePayroll(req.params.id as string);

    res.status(200).json({
      success: true,
      message: "Payroll deleted successfully.",
    });
  });

  getById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const payroll = await payrollService.getPayrollById(
      req.params.id as string
    );

    if (!payroll) {
      res.status(404).json({
        success: false,
        message: "Payroll not found.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: payroll,
    });
  });

  pay = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const payroll = await payrollService.payPayroll(req.params.id as string);

    res.status(200).json({
      success: true,
      message: "Payroll marked as PAID successfully.",
      data: payroll,
    });
  });
}

export default new PayrollController();
