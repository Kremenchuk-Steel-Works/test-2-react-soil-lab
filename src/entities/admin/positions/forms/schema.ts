import { z } from "zod"

export const positionsSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
})

export type PositionsFormFields = z.infer<typeof positionsSchema>
