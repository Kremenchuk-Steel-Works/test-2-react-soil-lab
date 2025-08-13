import { useCallback, useMemo, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  MoldPassportForm,
  moldPassportService,
  type MoldPassportFormFields,
} from '@/entities/molding-shop/mold-passport'
import type {
  MoldPassportDetailResponse,
  MoldPassportUpdate,
} from '@/shared/api/mold-passport/model'
import { getErrorMessage } from '@/shared/lib/axios'
import { logger } from '@/shared/lib/logger'
import { createUpdatePayload, type TransformMap } from '@/shared/lib/react-hook-form/api-operations'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import Button from '@/shared/ui/button/Button'

// Адаптируем данные с запроса под форму
function mapResponseToInitialData(response: MoldPassportDetailResponse): MoldPassportFormFields {
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

    moldCavities:
      response.moldCavities?.map((cavity) => ({
        ...cavity,
        castingPatternId: cavity.castingPattern.id,
        moldCores:
          cavity.moldCores?.map((core) => ({
            ...core,
            coreBatchId: core.coreBatch.id,
          })) ?? [],
      })) ?? [],

    isDefective: response.status === 'dismissed',
  }
}

export default function MoldPassportUpdate() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [mutationError, setMutationError] = useState<string | null>(null)

  const {
    data: responseData,
    isLoading,
    isError,
    error: queryError,
  } = useQuery({
    ...moldPassportService.getById(id!),
    placeholderData: keepPreviousData,
    enabled: !!id,
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
      }) satisfies TransformMap<MoldPassportFormFields>,
    [],
  )

  // Запрос на обновление
  const handleSubmit = useCallback(
    async (formData: MoldPassportFormFields) => {
      if (!responseData || !formDefaultValues || !id) return
      setMutationError(null)
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

        await moldPassportService.update(id, payload)
        navigate('..')
        return payload
      } catch (e) {
        setMutationError(getErrorMessage(e))
      }
    },
    [formDefaultValues, id, navigate, responseData, transformations],
  )

  return (
    <>
      <div className="flex items-center justify-between">
        <Button
          className="flex items-center justify-center gap-1 whitespace-nowrap"
          onClick={() => navigate('..')}
        >
          <ArrowLeft className="h-5 w-5" /> <span>Назад</span>
        </Button>
      </div>

      {(isError || mutationError) && (
        <AlertMessage
          type={AlertType.ERROR}
          message={mutationError ?? getErrorMessage(queryError)}
        />
      )}

      {!isLoading && responseData && formDefaultValues && (
        <div className="flex flex-wrap gap-x-2 gap-y-2">
          <div className="w-full">
            <MoldPassportForm
              onSubmit={handleSubmit}
              defaultValues={formDefaultValues}
              responseData={responseData}
              submitBtnName="Оновити"
            />
          </div>
        </div>
      )}
    </>
  )
}
