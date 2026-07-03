import { z } from "zod";

export const createEmployeeSchema = z.object({
    employeeCode: z
        .string()
        .min(1, "Employee code is required"),

    firstName: z
        .string()
        .min(1, "First name is required"),

    lastName: z
        .string()
        .min(1, "Last name is required"),

    email: z.string().email("Invalid email address"),

  phone: z.string().optional(),

    designation: z
        .string()
        .min(1, "Designation is required"),

    department: z.string().optional(),

    joiningDate: z.coerce.date(),

    salary: z.number().positive().optional(),

    status: z.string().optional(),

    organizationId: z
        .string()
        .min(1, "Organization ID is required"),
});

export const updateEmployeeSchema = createEmployeeSchema.partial();

export type CreateEmployeeInput =
    z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput =
    z.infer<typeof updateEmployeeSchema>;
