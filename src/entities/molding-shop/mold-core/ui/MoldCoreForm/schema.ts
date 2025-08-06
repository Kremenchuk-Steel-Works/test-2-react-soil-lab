import { z } from 'zod'

export const moldCoreFormSchema = z.object({
  coreBatchId: z.string().default('123'),
  hardness: z.number().default(0),
})

export type MoldCoreFormFields = z.infer<typeof moldCoreFormSchema>
export const moldCoreFormDefaultValues: MoldCoreFormFields = moldCoreFormSchema.parse({})
