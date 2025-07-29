import { z } from 'zod'

export const moldCoreSchema = z.object({
  coreBatchId: z.string().optional(),
  hardness: z.number().optional(),
})

export type MoldCoreFormFields = z.infer<typeof moldCoreSchema>

// Default value
export const moldCoreDefault: MoldCoreFormFields = {
  coreBatchId: undefined,
  hardness: undefined,
}
