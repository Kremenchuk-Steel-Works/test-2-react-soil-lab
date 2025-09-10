import type { MoistureCreateFormFields } from '@/features/soil-lab/experiments/moisture/create/model/schema'
import { createFormKit } from '@/shared/ui/react-hook-form/FormKit/formKit'

export const MoistureCreateFormKit = createFormKit<MoistureCreateFormFields>()
