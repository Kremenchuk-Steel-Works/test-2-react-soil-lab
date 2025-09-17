import type { DeepPartial } from 'react-hook-form'
import z from 'zod'
import { moistureBaseFormSchema } from '@/entities/soil-lab/experiments/moisture/ui/form/schema'

// export const moistureCreateFormSchema = createDynamicSchema(
//   moistureBaseFormSchema,
//   experimentsMoistureDynamicSections,
// )

export const moistureCreateFormSchema = moistureBaseFormSchema

export type MoistureCreateFormFields = z.infer<typeof moistureCreateFormSchema>

export const moistureCreateFormDefaultValues: DeepPartial<MoistureCreateFormFields> = {}
