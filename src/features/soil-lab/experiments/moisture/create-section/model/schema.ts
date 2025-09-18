import z from 'zod'
import { moistureBaseFormSchema } from '@/entities/soil-lab/experiments/moisture/ui/form/schema'

export const moistureCreateSectionFormSchema = moistureBaseFormSchema

export type MoistureCreateSectionFormFields = z.infer<typeof moistureCreateSectionFormSchema>
