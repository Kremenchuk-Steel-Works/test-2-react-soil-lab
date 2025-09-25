import type { TestsCreateFormFields } from '@/features/soil-lab/tests/create/model/schema'
import { createFormKit } from '@/shared/ui/react-hook-form/FormKit/formKit'

export const TestsCreateFormKit = createFormKit<TestsCreateFormFields>()
