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

export type CreateOrganizationInput =
  z.infer<typeof createOrganizationSchema>;