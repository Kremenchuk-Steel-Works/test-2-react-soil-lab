import type { MeasurementsGenerateReportFormFields } from '@/features/soil-lab/measurements/generate-report/model/schema'
import { createFormKit } from '@/shared/ui/react-hook-form/FormKit/formKit'

export const MeasurementsGenerateReportFormKit =
  createFormKit<MeasurementsGenerateReportFormFields>()
