import { Link, useParams } from 'react-router-dom'
import { samplesMixtures } from '@/entities/soil-lab/samples/model/mixtures'
import { testsService } from '@/entities/soil-lab/tests/api/service'
import { testTypeToUnit } from '@/entities/soil-lab/tests/lib/testTypeToUnit'
import { testsStatus } from '@/entities/soil-lab/tests/model/status'
import { testsType } from '@/entities/soil-lab/tests/model/type'
import { TestStatusPill } from '@/entities/soil-lab/tests/ui/status-pill/TestStatusPill'
import LoadingPage from '@/pages/system/LoadingPage'
import { getErrorMessage } from '@/shared/lib/axios'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import { InfoCard } from '@/shared/ui/InfoCard/InfoCard'
import { labelFromDict } from '@/utils/dict'
import { ConfiguredButton } from '@/widgets/page/ConfiguredButton'

export default function TestsDetails() {
  const { id } = useParams<{ id: string }>()

  const {
    data: responseData,
    isLoading,
    isPending,
    isFetching,
    isFetched,
    error: queryError,
  } = testsService.getById(id ?? '', {
    query: { enabled: Boolean(id) },
  })

  if (!id) return <AlertMessage type={AlertType.ERROR} message="Відсутній параметр id" />

  if (isLoading || isPending || isFetching) {
    return <LoadingPage />
  }

  if (queryError)
    return <AlertMessage type={AlertType.ERROR} message={getErrorMessage(queryError)} />

  if (!responseData && isFetched) {
    return <AlertMessage type={AlertType.WARNING} message="Дані не знайдені" />
  }

  const unit = testTypeToUnit(responseData.type)

  return (
    <>
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {/* --- Статус --- */}
        <InfoCard label="Статус">
          <TestStatusPill status={responseData.status}>
            {labelFromDict(testsStatus, responseData.status)}
          </TestStatusPill>
        </InfoCard>

        {/* --- Рецепт суміші --- */}
        <InfoCard label="Рецепт суміші">
          <Link
            to={`/soil-lab/samples/${responseData.sample.id}`}
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            {labelFromDict(samplesMixtures, responseData.sample.moldingSandRecipe)}
          </Link>
        </InfoCard>

        {/* --- Тип випробування --- */}
        <InfoCard label="Тип">{labelFromDict(testsType, responseData.type)}</InfoCard>

        {/* --- Дата створення --- */}
        <InfoCard label="Дата створення">
          {new Date(responseData.createdAt).toLocaleString()}
        </InfoCard>

        {/* --- Вимірювання --- */}
        <InfoCard label="Вимірювання 1">
          {responseData.measurement1} {unit}
        </InfoCard>

        <InfoCard label="Вимірювання 2">
          {responseData.measurement2} {unit}
        </InfoCard>

        {responseData.measurement3 !== null && responseData.measurement3 !== undefined && (
          <InfoCard label="Вимірювання 3">
            {responseData.measurement3} {unit}
          </InfoCard>
        )}

        {/* --- Обрані виміри --- */}
        <InfoCard label="Обраний вимір 1">
          {responseData.selectedMeasurement1} {unit}
        </InfoCard>

        <InfoCard label="Обраний вимір 2">
          {responseData.selectedMeasurement2} {unit}
        </InfoCard>

        {/* --- Агрегати/межі --- */}
        <InfoCard label="Середнє значення">
          {responseData.meanMeasurement} {unit}
        </InfoCard>

        <InfoCard label="Різниця (%)">{responseData.differencePercent}</InfoCard>

        <InfoCard label="Мінімальне допустиме значення">
          {responseData.lowerLimit} {unit}
        </InfoCard>

        <InfoCard label="Максимальне допустиме значення">
          {responseData.upperLimit} {unit}
        </InfoCard>
      </section>

      <div className="mt-2">
        <ConfiguredButton btnType="delete" disabled={isLoading} />
      </div>
    </>
  )
}
