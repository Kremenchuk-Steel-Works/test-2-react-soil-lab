import type { MoldPassportCreateFormFields } from '@/features/molding-shop-update/mold-passport/create/model/schema'
import { createFormKit } from '@/shared/ui/react-hook-form/FormKit/formKit'

export const MoldPassportCreateFormKit = createFormKit<MoldPassportCreateFormFields>()
