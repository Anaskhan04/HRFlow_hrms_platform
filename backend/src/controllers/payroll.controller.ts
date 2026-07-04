import { Request, Response, NextFunction } from "express";
import payrollService from "../services/payroll.service";
import { generatePayrollSchema } from "../validators/payroll.validator";

class PayrollController {
  async generate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = generatePayrollSchema.parse(req.body);

      const payroll = await payrollService.generatePayroll(data);

      res.status(201).json({
        success: true,
        message: "Payroll generated successfully.",
        data: payroll,
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
      const payrolls = await payrollService.getPayrolls();

      res.status(200).json({
        success: true,
        data: payrolls,
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
    } catch (error) {
      next(error);
    }
  }

  async pay(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const payroll = await payrollService.payPayroll(
        req.params.id as string
      );

      res.status(200).json({
        success: true,
        message: "Payroll marked as PAID successfully.",
        data: payroll,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new PayrollController();
