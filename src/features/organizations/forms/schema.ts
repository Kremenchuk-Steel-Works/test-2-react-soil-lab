import { z } from "zod"

export const organizationsSchema = z.object({
  name: z.string().nonempty(),
  country: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
})

export type OrganizationsFormFields = z.infer<typeof organizationsSchema>
