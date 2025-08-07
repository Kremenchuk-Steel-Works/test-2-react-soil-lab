import { useMemo } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  MoldPassportForm,
  moldPassportService,
  type MoldPassportFormFields,
  type MoldPassportFormInitialData,
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
function mapResponseToInitialData(
  response: MoldPassportDetailResponse,
): MoldPassportFormInitialData {
  return {
    defaultValues: {
      ...response,
      moldingAreaId: response.moldingArea.id,
      castingTechnologyId: response.castingTechnology.id,
      dataAsc: { ...response.dataAsc, resinId: response.dataAsc?.resin?.id },
      patternPlateFrameId: response.patternPlateFrame?.id,
      moldingFlaskId: response.moldingFlask?.id,

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
    },
    options: {
      moldingArea: [
        {
          value: response.moldingArea.id,
          label: response.moldingArea.name,
        },
      ],
      castingTechnology: [
        {
          value: response.castingTechnology.id,
          label: response.castingTechnology.name,
        },
      ],
      resin: response.dataAsc?.resin
        ? [{ value: response.dataAsc.resin.id, label: response.dataAsc.resin.serialNumber }]
        : [],
      patternPlateFrame: response.patternPlateFrame
        ? [{ value: response.patternPlateFrame.id, label: response.patternPlateFrame.serialNumber }]
        : [],
      moldingFlask: response.moldingFlask
        ? [{ value: response.moldingFlask.id, label: response.moldingFlask.serialNumber }]
        : [],
    },
  }
}

export default function MoldPassportUpdate() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const {
    data: initialData,
    isLoading,
    isError,
    error: queryError,
  } = useQuery({
    ...moldPassportService.getById(id!),
    placeholderData: keepPreviousData,
    enabled: !!id,
  })

  const formInitialData = useMemo(() => {
    if (!initialData) {
      return null // Возвращаем null, пока данные не загружены
    }
    return mapResponseToInitialData(initialData)
  }, [initialData])

  // Запрос на обновление
  const handleSubmit = async (formData: MoldPassportFormFields) => {
    if (!initialData) {
      return
    }

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
      initialData,
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

      {!isLoading && formInitialData && (
        <div className="flex flex-wrap gap-x-2 gap-y-2">
          <div className="w-full">
            <MoldPassportForm
              onSubmit={handleSubmit}
              initialData={formInitialData}
              submitBtnName="Оновити"
            />
          </div>
        </div>
      )}
    </>
  )
}
