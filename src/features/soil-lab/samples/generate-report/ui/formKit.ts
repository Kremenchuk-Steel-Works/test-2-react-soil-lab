import type { SamplesGenerateReportFormFields } from '@/features/soil-lab/samples/generate-report/model/schema'
import { createFormKit } from '@/shared/ui/react-hook-form/FormKit/formKit'

export const SamplesGenerateReportFormKit = createFormKit<SamplesGenerateReportFormFields>()
