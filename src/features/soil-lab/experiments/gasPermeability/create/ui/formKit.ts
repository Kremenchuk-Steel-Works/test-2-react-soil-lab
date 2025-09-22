import type { GasPermeabilityCreateFormFields } from '@/features/soil-lab/experiments/gasPermeability/create/model/schema'
import { createFormKit } from '@/shared/ui/react-hook-form/FormKit/formKit'

export const GasPermeabilityCreateFormKit = createFormKit<GasPermeabilityCreateFormFields>()
