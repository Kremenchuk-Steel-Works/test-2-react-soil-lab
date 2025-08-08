import { useMemo } from 'react'
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
  MoldPassportUpdateDataAscOperation,
  MoldPassportUpdateDataGscOperation,
  MoldPassportUpdateMoldCavityOperations,
} from '@/shared/api/mold-passport/model'
import { getErrorMessage } from '@/shared/lib/axios'
import {
  createApiArrayOperations,
  createApiObjectOperation,
  createUpdatePayload,
} from '@/shared/lib/react-hook-form/api-operations'
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

    dataAsc: response.dataAsc ? { ...response.dataAsc, resinId: response.dataAsc.resin?.id } : null,

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

    assemblyTimestamp: response.moldAssemblyTimestamp ?? null,
  }
}

export default function MoldPassportUpdate() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

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

  // Запрос на обновление
  const handleSubmit = async (formData: MoldPassportFormFields) => {
    if (!responseData) return

    // Определяем правила трансформации
    const transformations = {
      dataGsc: {
        targetKey: 'dataGscOperation',
        transformer: (initial: any, form: any) =>
          createApiObjectOperation(initial, form) as MoldPassportUpdateDataGscOperation,
      },
      dataAsc: {
        targetKey: 'dataAscOperation',
        transformer: (initial: any, form: any) =>
          createApiObjectOperation(initial, form) as MoldPassportUpdateDataAscOperation,
      },
      moldCavities: {
        targetKey: 'moldCavityOperations',
        transformer: (initial: any, form: any) =>
          createApiArrayOperations(initial, form) as MoldPassportUpdateMoldCavityOperations,
      },
    }

    const payload = createUpdatePayload(
      responseData,
      formData,
      transformations,
    ) as MoldPassportUpdate

    await moldPassportService.update(id!, payload)
    navigate('..')
    return payload
  }

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

      {isError && <AlertMessage type={AlertType.ERROR} message={getErrorMessage(queryError)} />}

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
