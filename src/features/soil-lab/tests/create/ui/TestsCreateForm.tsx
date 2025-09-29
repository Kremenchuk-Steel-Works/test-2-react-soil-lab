import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form'
import { testsDynamicSections } from '@/entities/soil-lab/tests/ui/form/lib/dynamic-sections'
import {
  testsCreateFormSchema,
  type TestsCreateFormFields,
} from '@/features/soil-lab/tests/create/model/schema'
import { TestsCreateFormKit } from '@/features/soil-lab/tests/create/ui/formKit'
import { TestsCreateBaseForm } from '@/features/soil-lab/tests/create/ui/TestsCreateBaseForm'
import type { SampleDetailResponse } from '@/shared/api/soil-lab-2/model'
import { applyServerErrors } from '@/shared/lib/axios/applyServerErrors'
import { createLogger } from '@/shared/lib/logger'
import { createDynamicEngine } from '@/shared/lib/zod/dynamic-resolver'
import { DynamicFieldsProvider } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldsContext'
import { FormKitProvider } from '@/shared/ui/react-hook-form/FormKit/FormKitProvider'
import { FormLayout } from '@/shared/ui/react-hook-form/FormLayout'
import type { FormProps } from '@/types/react-hook-form'

const logger = createLogger('TestsCreateForm')

type FormFields = TestsCreateFormFields
const schema = testsCreateFormSchema

type TestsFormProps = FormProps<FormFields, SampleDetailResponse>

const Form = TestsCreateFormKit

export function TestsCreateForm({
  defaultValues,
  responseData,
  onSubmit,
  submitBtnName,
}: TestsFormProps) {
  const { resolver, valueNormalizer } = createDynamicEngine<FormFields>(
    schema,
    testsDynamicSections,
  )

  const form = useForm<FormFields>({
    resolver,
    defaultValues,
  })

  const {
    handleSubmit,
    setError,
    setFocus,
    getValues,
    formState: { isSubmitting },
  } = form

  // Submit
  const submitHandler: SubmitHandler<FormFields> = async (data) => {
    try {
      const response = await onSubmit(data)
      logger.debug('Форма успешно выполнена', response)
    } catch (err) {
      applyServerErrors({
        err,
        getValues,
        setError,
        setFocus,
        summary: {
          includeKnownExtra: true,
          noUnknownLabelPrefix: true,
        },
      })
    }
  }

  return (
    <FormProvider {...form}>
      <FormLayout onSubmit={(e) => void handleSubmit(submitHandler)(e)}>
        <FormKitProvider value={Form}>
          <DynamicFieldsProvider
            sections={testsDynamicSections}
            valueNormalizer={valueNormalizer}
            responseData={responseData}
            meta={{ submitBtnName, isSubmitting }}
          >
            <TestsCreateBaseForm responseData={responseData} />
          </DynamicFieldsProvider>
        </FormKitProvider>
      </FormLayout>
    </FormProvider>
  )
}
