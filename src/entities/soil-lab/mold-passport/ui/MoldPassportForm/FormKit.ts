import type { MoldPassportCreateFormFields } from '@/entities/soil-lab/mold-passport/ui/MoldPassportForm/schema'
import { createFormKit } from '@/shared/ui/react-hook-form/FormKit/formKit'

export const MoldPassportCreateFormKit = createFormKit<MoldPassportCreateFormFields>()
