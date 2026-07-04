import { z } from "zod";

export const checkInSchema = z.object({
  employeeId: z.string().min(1, "Employee ID cannot be empty").optional(),
  remarks: z.string().optional(),
});

export const checkOutSchema = z.object({
  employeeId: z.string().min(1, "Employee ID cannot be empty").optional(),
  remarks: z.string().optional(),
});

export type CheckInInput = z.infer<typeof checkInSchema>;
export type CheckOutInput = z.infer<typeof checkOutSchema>;
