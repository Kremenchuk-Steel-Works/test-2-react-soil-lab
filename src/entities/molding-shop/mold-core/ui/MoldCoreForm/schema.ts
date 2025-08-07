import type { DeepPartial } from 'react-hook-form'
import { z } from 'zod'

export const moldCoreFormSchema = z.object({
  coreBatchId: z.string(),
  hardness: z.number(),
})

export type MoldCoreFormFields = z.infer<typeof moldCoreFormSchema>
export const moldCoreFormDefaultValues: DeepPartial<MoldCoreFormFields> = {}
