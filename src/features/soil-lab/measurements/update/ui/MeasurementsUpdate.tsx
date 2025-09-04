import { useCallback, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { moldPassportService } from '@/entities/molding-shop-update/mold-passport'
import type { MeasurementsUpdateFormFields } from '@/features/soil-lab/measurements/update/model/schema'
import { MeasurementsUpdateForm } from '@/features/soil-lab/measurements/update/ui/MeasurementsUpdateForm'
import {
  getGetMoldPassportApiV1MoldPassportsMoldPassportIdGetQueryKey,
  getGetMoldPassportsListApiV1MoldPassportsGetQueryKey,
} from '@/shared/api/mold-passport/endpoints/mold-passports/mold-passports'
import type {
  MoldPassportDetailResponse,
  MoldPassportUpdate,
} from '@/shared/api/mold-passport/model'
import { getErrorMessage } from '@/shared/lib/axios'
import { logger } from '@/shared/lib/logger'
import { createUpdatePayload } from '@/shared/lib/react-hook-form/api-operations'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'

interface MeasurementsUpdateProps {
  id: string
  onSuccess?: (res: unknown) => void
  onError?: (err: unknown) => void
}

// Адаптируем данные с запроса под форму
function mapResponseToInitialData(
  response: MoldPassportDetailResponse,
): MeasurementsUpdateFormFields {
  return {
    ...response,
  }
}

export default function MeasurementsUpdate({ id, onSuccess, onError }: MeasurementsUpdateProps) {
  const queryClient = useQueryClient()

  const {
    data: responseData,
    isLoading,
    error: queryError,
  } = moldPassportService.getById(id, {
    query: { enabled: !!id },
  })

  const {
    mutateAsync,
    error: mutationError,
    isPending,
  } = moldPassportService.update({
    mutation: {
      onSuccess: (res, variables) => {
        const queryKeyList = getGetMoldPassportsListApiV1MoldPassportsGetQueryKey()
        const queryKeyDetail = getGetMoldPassportApiV1MoldPassportsMoldPassportIdGetQueryKey(
          variables.moldPassportId,
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
        const payload: MoldPassportUpdate = createUpdatePayload(formDefaultValues, formData)

        logger.debug('[MeasurementsUpdate] payload', payload)

        await mutateAsync({ moldPassportId: id, data: payload })
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
