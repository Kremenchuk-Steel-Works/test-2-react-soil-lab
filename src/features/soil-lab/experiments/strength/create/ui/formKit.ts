import type { StrengthCreateFormFields } from '@/features/soil-lab/experiments/strength/create/model/schema'
import { createFormKit } from '@/shared/ui/react-hook-form/FormKit/formKit'

export const StrengthCreateFormKit = createFormKit<StrengthCreateFormFields>()
