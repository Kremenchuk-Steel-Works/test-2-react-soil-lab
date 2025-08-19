import type { MoldPassportFormFields } from '@/entities/soil-lab/mold-passport/ui/MoldPassportForm/schema'
import { createFormKit } from '@/shared/ui/react-hook-form/formKit'

export const MoldPassportFormKit = createFormKit<MoldPassportFormFields>()
