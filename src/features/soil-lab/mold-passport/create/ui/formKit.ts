import type { MoldPassportCreateFormFields } from '@/features/soil-lab/mold-passport/create/model/schema'
import { createFormKit } from '@/shared/ui/react-hook-form/FormKit/formKit'

export const MoldPassportCreateFormKit = createFormKit<MoldPassportCreateFormFields>()
