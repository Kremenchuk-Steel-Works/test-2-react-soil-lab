import type { DeepPartial } from 'react-hook-form'
import { z } from 'zod'
import { zn } from '@/shared/lib/zod/zod-normalize'

export const moldCoreFormSchema = z.object({
  id: zn(z.string().optional()),
  coreBatchId: zn(z.string()),
  hardness: zn(z.number()),
})

export type MoldCoreFormFields = z.infer<typeof moldCoreFormSchema>
export const moldCoreFormDefaultValues: DeepPartial<MoldCoreFormFields> = {}
