import type { DeepPartial } from 'react-hook-form'
import z from 'zod'
import { gasPermeabilityBaseFormSchema } from '@/entities/soil-lab/experiments/gasPermeability/ui/form/schema'

export const gasPermeabilityCreateFormSchema = gasPermeabilityBaseFormSchema

export type GasPermeabilityCreateFormFields = z.infer<typeof gasPermeabilityCreateFormSchema>

export const gasPermeabilityCreateFormDefaultValues: DeepPartial<GasPermeabilityCreateFormFields> =
  {}
