import { z } from "zod";
import { LeaveStatus } from "@prisma/client";

const baseLeaveSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  leaveTypeId: z.string().min(1, "Leave Type ID is required"),
  startDate: z.coerce.date({
    message: "Valid start date is required",
  }),
  endDate: z.coerce.date({
    message: "Valid end date is required",
  }),
  reason: z.string().min(1, "Reason is required"),
  status: z.nativeEnum(LeaveStatus).optional(),
});

export const createLeaveSchema = baseLeaveSchema.refine(
  (data) => data.startDate <= data.endDate,
  {
    message: "startDate cannot be after endDate",
    path: ["startDate"],
  }
);

export const updateLeaveSchema = baseLeaveSchema.partial().refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return data.startDate <= data.endDate;
    }
    return true;
  },
  {
    message: "startDate cannot be after endDate",
    path: ["startDate"],
  }
);

export type CreateLeaveInput = z.infer<typeof createLeaveSchema>;
export type UpdateLeaveInput = z.infer<typeof updateLeaveSchema>;
