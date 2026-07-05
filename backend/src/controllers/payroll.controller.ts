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
    const payrolls = await payrollService.getPayrolls();

    res.status(200).json({
      success: true,
      data: payrolls,
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
