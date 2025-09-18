import z from 'zod'
import { strengthBaseFormSchema } from '@/entities/soil-lab/experiments/strength/ui/form/schema'

export const strengthCreateSectionFormSchema = strengthBaseFormSchema

export type StrengthCreateSectionFormFields = z.infer<typeof strengthCreateSectionFormSchema>
