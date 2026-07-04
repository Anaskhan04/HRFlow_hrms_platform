import { z } from "zod";

export const createDepartmentSchema = z.object({
  name: z
    .string()
    .min(1, "Department name is required"),

  description: z.string().optional(),

  organizationId: z
    .string()
    .min(1, "Organization ID is required"),
});

export const updateDepartmentSchema = createDepartmentSchema.partial();

export type CreateDepartmentInput =
  z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentInput =
  z.infer<typeof updateDepartmentSchema>;
