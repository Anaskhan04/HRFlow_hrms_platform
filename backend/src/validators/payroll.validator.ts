import { z } from "zod";

export const generatePayrollSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  month: z.coerce
    .number()
    .int()
    .min(1, "Month must be between 1 and 12")
    .max(12, "Month must be between 1 and 12"),
  year: z.coerce.number().int().min(2000, "Valid year is required"),
  basicSalary: z.coerce
    .number()
    .nonnegative("Basic salary cannot be negative")
    .optional(),
  allowances: z.coerce
    .number()
    .nonnegative("Allowances cannot be negative")
    .optional(),
  deductions: z.coerce
    .number()
    .nonnegative("Deductions cannot be negative")
    .optional(),
});

export type GeneratePayrollInput = z.infer<typeof generatePayrollSchema>;
