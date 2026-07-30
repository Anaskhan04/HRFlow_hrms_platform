    import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(3, "Organization name must be at least 3 characters"),

  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers and hyphens"),

  email: z.email(),

  phone: z.string().optional(),

  website: z.url().optional(),

  logoUrl: z.url().optional(),

  description: z.string().optional(),

  industry: z.string().optional(),

  address: z.string().optional(),

  country: z.string().min(2),

  timezone: z.string().min(2),
});

export const updateOrganizationSchema = z.object({
  name: z
    .string()
    .min(3, "Organization name must be at least 3 characters")
    .optional(),

  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers and hyphens")
    .optional(),

  email: z.email().optional(),

  phone: z.string().optional(),

  website: z.url().optional(),

  logoUrl: z.url().optional(),

  description: z.string().optional(),

  industry: z.string().optional(),

  address: z.string().optional(),

  country: z.string().min(2).optional(),

  timezone: z.string().min(2).optional(),

  isActive: z.boolean().optional(),
});

export type CreateOrganizationInput =
  z.infer<typeof createOrganizationSchema>;

export type UpdateOrganizationInput =
  z.infer<typeof updateOrganizationSchema>;