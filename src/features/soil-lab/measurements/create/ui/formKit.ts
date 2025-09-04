import type { MeasurementsCreateFormFields } from '@/features/soil-lab/measurements/create/model/schema'
import { createFormKit } from '@/shared/ui/react-hook-form/FormKit/formKit'

export const MeasurementsCreateFormKit = createFormKit<MeasurementsCreateFormFields>()
