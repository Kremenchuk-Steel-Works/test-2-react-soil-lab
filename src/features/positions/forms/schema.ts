import { z } from "zod"

export const positionsSchema = z.object({
  name: z.string().nonempty(),
  desciption: z.string().optional(),
})

export type PositionsFormFields = z.infer<typeof positionsSchema>
