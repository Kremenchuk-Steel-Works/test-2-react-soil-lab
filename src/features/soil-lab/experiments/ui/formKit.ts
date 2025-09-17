import type { ExperimentsCreateFormFields } from '@/features/soil-lab/experiments/model/schema'
import { createFormKit } from '@/shared/ui/react-hook-form/FormKit/formKit'

export const ExperimentsCreateFormKit = createFormKit<ExperimentsCreateFormFields>()
