import { useCallback, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { DeepPartial } from 'react-hook-form'
import { samplesService } from '@/entities/soil-lab/samples/api/service'
import { testsService } from '@/entities/soil-lab/tests/api/service'
import type { TestsCreateFormFields } from '@/features/soil-lab/tests/create/model/schema'
import { TestsCreateForm } from '@/features/soil-lab/tests/create/ui/TestsCreateForm'
import {
  getGetTestsListApiV1TestsGetQueryKey,
  type CreateTestApiV1TestsPostMutationResult,
} from '@/shared/api/soil-lab/endpoints/tests/tests'
import {
  TestType,
  type HTTPValidationError,
  type SampleDetailResponse,
} from '@/shared/api/soil-lab/model'
import { getErrorMessage } from '@/shared/lib/axios'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'

interface TestsCreateProps {
  id: string
  type: TestType
  onSuccess?: (res: CreateTestApiV1TestsPostMutationResult) => void
  onError?: (err: HTTPValidationError) => void
}

// Адаптируем данные с запроса под форму
function mapResponseToInitialData(
  response: SampleDetailResponse,
  type: TestType,
): DeepPartial<TestsCreateFormFields> {
  return {
    sampleId: response.id,
    // moldingSandRecipe: response.moldingSandRecipe,
    moldingSandRecipe: '13',
    type: type,
  }
}

export default function TestsCreate({ id, type, onSuccess, onError }: TestsCreateProps) {
  const queryClient = useQueryClient()
  console.log('ID', id)

  const {
    data: responseData,
    isLoading,
    error: queryError,
  } = samplesService.getById(id, {
    query: { enabled: !!id },
  })

  const { mutateAsync } = testsService.create({
    mutation: {
      onSuccess: (res) => {
        void queryClient.invalidateQueries({
          queryKey: getGetTestsListApiV1TestsGetQueryKey(),
        })
        onSuccess?.(res)
      },
      onError: (err) => onError?.(err),
    },
  })

  const formDefaultValues = useMemo(() => {
    if (!responseData) return undefined
    return mapResponseToInitialData(responseData, type)
  }, [responseData, type])

  // Запрос на добавление
  const handleSubmit = useCallback(
    async (form: TestsCreateFormFields) => {
      await mutateAsync({
        data: {
          sampleId: form.sampleId,
          type: form.type,
          measurement1: form.measurement1,
        },
      })
      return form
    },
    [mutateAsync],
  )

  return (
    <>
      {queryError && <AlertMessage type={AlertType.ERROR} message={getErrorMessage(queryError)} />}

      {!isLoading && responseData && formDefaultValues && (
        <TestsCreateForm
          onSubmit={handleSubmit}
          defaultValues={formDefaultValues}
          responseData={responseData}
          submitBtnName="Відправити"
        />
      )}
    </>
  )
}
