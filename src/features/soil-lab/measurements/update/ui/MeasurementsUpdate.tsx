import { useCallback, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { measurementsService } from '@/entities/soil-lab/measurements'
import type { MeasurementsUpdateFormFields } from '@/features/soil-lab/measurements/update/model/schema'
import { MeasurementsUpdateForm } from '@/features/soil-lab/measurements/update/ui/MeasurementsUpdateForm'
import {
  getGetMeasurementApiV1MeasurementsMeasurementIdGetQueryKey,
  getGetMeasurementsListApiV1MeasurementsGetQueryKey,
} from '@/shared/api/soil-lab/endpoints/measurements/measurements'
import type { MeasurementDetailResponse, MeasurementUpdate } from '@/shared/api/soil-lab/model'
import { getErrorMessage } from '@/shared/lib/axios'
import { logger } from '@/shared/lib/logger'
import { createUpdatePayload } from '@/shared/lib/react-hook-form/api-operations'
import { Instruments, Units } from '@/shared/lib/zod/unit-conversion/unit-types'
import { withUnitConversion } from '@/shared/lib/zod/unit-conversion/withUnitConversion'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'

interface MeasurementsUpdateProps {
  id: string
  onSuccess?: (res: unknown) => void
  onError?: (err: unknown) => void
}

// Адаптируем данные с запроса под форму
function mapResponseToInitialData(
  response: MeasurementDetailResponse,
): MeasurementsUpdateFormFields {
  return {
    ...response,
    moldingSandStrengthKgfCm2: withUnitConversion(response.moldingSandStrengthKgfCm2, {
      from: Units.KGF_PER_CM2,
      to: Units.N_PER_CM2,
    }),
    moldingSandGasPermeability: withUnitConversion(response.moldingSandGasPermeability, {
      from: Units.PN,
      to: Units.SI_E8,
      instrument: Instruments.LPIR1,
    }),
  }
}

export default function MeasurementsUpdate({ id, onSuccess, onError }: MeasurementsUpdateProps) {
  const queryClient = useQueryClient()

  const {
    data: responseData,
    isLoading,
    error: queryError,
  } = measurementsService.getById(id, {
    query: { enabled: !!id },
  })

  const {
    mutateAsync,
    error: mutationError,
    isPending,
  } = measurementsService.update({
    mutation: {
      onSuccess: (res, variables) => {
        const queryKeyList = getGetMeasurementsListApiV1MeasurementsGetQueryKey()
        const queryKeyDetail = getGetMeasurementApiV1MeasurementsMeasurementIdGetQueryKey(
          variables.measurementId,
        )

        return Promise.all([
          queryClient.invalidateQueries({ queryKey: queryKeyList }),
          queryClient.invalidateQueries({ queryKey: queryKeyDetail }),
        ]).finally(() => {
          onSuccess?.(res)
        })
      },
      onError: (err) => onError?.(err),
    },
  })

  const formDefaultValues = useMemo(() => {
    if (!responseData) return undefined
    return mapResponseToInitialData(responseData)
  }, [responseData])

  // Запрос на обновление
  const handleSubmit = useCallback(
    async (formData: MeasurementsUpdateFormFields) => {
      if (!responseData || !formDefaultValues || !id || isPending) return

      try {
        const payload: MeasurementUpdate = createUpdatePayload(formDefaultValues, formData)

        logger.debug('[MeasurementsUpdate] payload', payload)

        await mutateAsync({ measurementId: id, data: payload })
        return payload
      } catch (e) {
        logger.error('[MeasurementsUpdate] Mutation failed', e)
      }
    },
    [responseData, formDefaultValues, id, mutateAsync, isPending],
  )

  const combinedError = mutationError || queryError

  return (
    <>
      {combinedError && (
        <AlertMessage type={AlertType.ERROR} message={getErrorMessage(combinedError)} />
      )}

      {!isLoading && responseData && formDefaultValues && (
        <MeasurementsUpdateForm
          onSubmit={handleSubmit}
          defaultValues={formDefaultValues}
          responseData={responseData}
          submitBtnName="Оновити"
        />
      )}
    </>
  )
}
