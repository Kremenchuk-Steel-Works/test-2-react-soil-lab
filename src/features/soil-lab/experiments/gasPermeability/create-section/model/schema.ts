import z from 'zod'
import { gasPermeabilityBaseFormSchema } from '@/entities/soil-lab/experiments/gasPermeability/ui/form/schema'

export const gasPermeabilityCreateSectionFormSchema = gasPermeabilityBaseFormSchema

export type GasPermeabilityCreateSectionFormFields = z.infer<
  typeof gasPermeabilityCreateSectionFormSchema
>
