import type { DeepPartial } from 'react-hook-form'
import z from 'zod'
import { strengthBaseFormSchema } from '@/entities/soil-lab/experiments/strength/ui/form/schema'

export const strengthCreateFormSchema = strengthBaseFormSchema

export type StrengthCreateFormFields = z.infer<typeof strengthCreateFormSchema>

export const strengthCreateFormDefaultValues: DeepPartial<StrengthCreateFormFields> = {}
