import { useCallback, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { DeepPartial } from 'react-hook-form'
import { samplesService } from '@/entities/soil-lab/samples/api/service'
import { testsService } from '@/entities/soil-lab/test-results/api/service'
import type { TestsCreateFormFields } from '@/features/soil-lab/tests/create/model/schema'
import { TestsCreateForm } from '@/features/soil-lab/tests/create/ui/TestsCreateForm'
import {
  getGetSampleApiV1SamplesSampleIdGetQueryKey,
  getGetSamplesListApiV1SamplesGetQueryKey,
} from '@/shared/api/soil-lab/endpoints/samples/samples'
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
import { Instruments, Units } from '@/shared/lib/zod/unit-conversion/unit-registry'
import { withUnitConversion } from '@/shared/lib/zod/unit-conversion/withUnitConversion'
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
  const test = response.tests.find((t) => t.type === type)
  const meanMeasurement = test?.meanMeasurement
  return {
    sampleId: response.id,
    moldingSandRecipe: response.moldingSandRecipe,
    type: type,
    measurement1: convertApiToUi(meanMeasurement, type),
  }
}

function convertApiToUi(value: number | undefined, type: TestType): number | undefined {
  if (value == null) return undefined

  switch (type) {
    case TestType.gas_permeability:
      return withUnitConversion(value, {
        from: Units.PN,
        to: Units.SI_E8,
        instrument: Instruments.LPIR1,
        round: 0,
      })
    case TestType.compressive_strength:
      return withUnitConversion(value, {
        from: Units.KGF_PER_CM2,
        to: Units.N_PER_CM2,
        round: 2,
      })
    case TestType.moisture_percent:
    default:
      return value
  }
}

export default function TestsCreate({ id, type, onSuccess, onError }: TestsCreateProps) {
  const queryClient = useQueryClient()

  const {
    data: responseData,
    isLoading,
    error: queryError,
  } = samplesService.getById(id, {
    query: { enabled: !!id },
  })

  const { mutateAsync } = testsService.create({
    mutation: {
      onSuccess: (res, variables) => {
        const queryKeyList = getGetTestsListApiV1TestsGetQueryKey()
        const queryKeySampleList = getGetSamplesListApiV1SamplesGetQueryKey()
        const queryKeySampleDetail = getGetSampleApiV1SamplesSampleIdGetQueryKey(
          variables.data.sampleId,
        )

        return Promise.all([
          queryClient.invalidateQueries({ queryKey: queryKeyList }),
          queryClient.invalidateQueries({ queryKey: queryKeySampleList }),
          queryClient.invalidateQueries({ queryKey: queryKeySampleDetail }),
        ]).finally(() => {
          onSuccess?.(res)
        })
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
