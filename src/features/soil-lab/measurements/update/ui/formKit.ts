import type { MeasurementsUpdateFormFields } from '@/features/soil-lab/measurements/update/model/schema'
import { createFormKit } from '@/shared/ui/react-hook-form/FormKit/formKit'

export const MeasurementsUpdateFormKit = createFormKit<MeasurementsUpdateFormFields>()
