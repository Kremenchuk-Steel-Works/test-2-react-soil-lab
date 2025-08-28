import type { DeepPartial } from 'react-hook-form'
import z from 'zod'
import {
  moldPassportBaseFormSchema,
  moldPassportDynamicSections,
} from '@/entities/soil-lab/mold-passport'
import { createDynamicSchema } from '@/shared/lib/zod/dynamic-schema'

export const moldPassportCreateFormSchema = createDynamicSchema(
  moldPassportBaseFormSchema,
  moldPassportDynamicSections,
)
export type MoldPassportCreateFormFields = z.infer<typeof moldPassportCreateFormSchema>
export const moldPassportCreateFormDefaultValues: DeepPartial<MoldPassportCreateFormFields> = {
  moldCavities: [],
}
