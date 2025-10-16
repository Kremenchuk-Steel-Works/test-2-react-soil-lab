import type { DeepPartial } from 'react-hook-form'
import z from 'zod'
import { testsBaseFormSchema } from '@/entities/soil-lab/test-results/ui/form/schema'

export const testsCreateFormSchema = testsBaseFormSchema
export type TestsCreateFormFields = z.infer<typeof testsCreateFormSchema>

export const testsCreateFormDefaultValues: DeepPartial<TestsCreateFormFields> = {}
