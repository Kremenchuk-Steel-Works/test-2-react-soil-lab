import { useCallback, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { moldPassportService } from '@/entities/soil-lab/mold-passport'
import type { MoldPassportCreateFormFields } from '@/features/soil-lab/mold-passport/create/model/schema'
import { MoldPassportCreateForm } from '@/features/soil-lab/mold-passport/create/ui/MoldPassportCreateForm'
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
import { createUpdatePayload, type TransformMap } from '@/shared/lib/react-hook-form/api-operations'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'

interface MoldPassportUpdateProps {
  id: string
  onSuccess?: (res: unknown) => void
  onError?: (err: unknown) => void
}

// Адаптируем данные с запроса под форму
function mapResponseToInitialData(
  response: MoldPassportDetailResponse,
): MoldPassportCreateFormFields {
  return {
    ...response,
    moldingAreaId: response.moldingArea.id,
    castingTechnologyId: response.castingTechnology.id,

    patternPlateFrameId: response.patternPlateFrame?.id,
    moldingFlaskId: response.moldingFlask?.id,

    dataGsc: response.dataGsc
      ? {
          ...response.dataGsc,
          id: response.dataGsc.moldPassportId,
        }
      : null,

    dataAsc: response.dataAsc
      ? {
          ...response.dataAsc,
          id: response.dataAsc.moldPassportId,
          resinId: response.dataAsc.resin?.id,
        }
      : null,

    moldCavities: response.moldCavities?.map((cavity) => ({
      ...cavity,
      castingPatternId: cavity.castingPattern.id,
      moldCores:
        cavity.moldCores?.map((core) => ({
          ...core,
          coreBatchId: core.coreBatch.id,
        })) ?? [],
    })),

    isDefective: response.status === 'dismissed',
  }
}

export default function MoldPassportUpdate({ id, onSuccess, onError }: MoldPassportUpdateProps) {
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

  // Операции
  const transformations = useMemo(
    () =>
      ({
        dataGsc: { type: 'object', targetKey: 'dataGscOperation' },
        dataAsc: { type: 'object', targetKey: 'dataAscOperation' },
        moldCavities: {
          type: 'array',
          targetKey: 'moldCavityOperations',
          nested: {
            // заменяем массив form.moldCores -> операции moldCoreOperations
            moldCores: { type: 'array', targetKey: 'moldCoreOperations' },
          },
        },
      }) satisfies TransformMap<MoldPassportCreateFormFields>,
    [],
  )

  // Запрос на обновление
  const handleSubmit = useCallback(
    async (formData: MoldPassportCreateFormFields) => {
      if (!responseData || !formDefaultValues || !id || isPending) return

      try {
        logger.debug('[MoldPassportUpdate] formDefaultValues', formDefaultValues)
        logger.debug('[MoldPassportUpdate] formData', formData)
        logger.debug('[MoldPassportUpdate] transformations', transformations)
        const payload: MoldPassportUpdate = createUpdatePayload(
          formDefaultValues,
          formData,
          transformations,
        )

        logger.debug('[MoldPassportUpdate] payload', payload)

        await mutateAsync({ moldPassportId: id, data: payload })
        return payload
      } catch (e) {
        logger.error('[MoldPassportUpdate] Mutation failed', e)
      }
    },
    [responseData, formDefaultValues, id, transformations, mutateAsync, isPending],
  )

  const combinedError = mutationError || queryError

  return (
    <>
      {combinedError && (
        <AlertMessage type={AlertType.ERROR} message={getErrorMessage(combinedError)} />
      )}

      {!isLoading && responseData && formDefaultValues && (
        <MoldPassportCreateForm
          onSubmit={handleSubmit}
          defaultValues={formDefaultValues}
          responseData={responseData}
          submitBtnName="Оновити"
        />
      )}
    </>
  )
}
