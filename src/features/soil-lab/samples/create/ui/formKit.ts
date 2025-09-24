import type { SamplesCreateFormFields } from '@/features/soil-lab/samples/create/model/schema'
import { createFormKit } from '@/shared/ui/react-hook-form/FormKit/formKit'

export const SamplesCreateFormKit = createFormKit<SamplesCreateFormFields>()
