import { z } from 'zod'

export const moldCoreFormSchema = z.object({
  coreBatchId: z.string().optional(),
  hardness: z.number().optional(),
})

export type MoldCoreFormFields = z.infer<typeof moldCoreFormSchema>
export const moldCoreFormDefaultValues: MoldCoreFormFields = moldCoreFormSchema.parse({})
