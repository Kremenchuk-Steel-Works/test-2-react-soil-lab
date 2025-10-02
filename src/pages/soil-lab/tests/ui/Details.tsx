import { Link, useParams } from 'react-router-dom'
import { samplesFieldRegistry } from '@/entities/soil-lab/samples/model/fields-registry'
import { samplesMixtures } from '@/entities/soil-lab/samples/model/mixtures'
import { testsService } from '@/entities/soil-lab/tests/api/service'
import { testTypeToUnit } from '@/entities/soil-lab/tests/lib/testTypeToUnit'
import { testsResponseFieldRegistry } from '@/entities/soil-lab/tests/model/fields-registry'
import { testsStatus } from '@/entities/soil-lab/tests/model/status'
import { testsType } from '@/entities/soil-lab/tests/model/type'
import { TestStatusPill } from '@/entities/soil-lab/tests/ui/status-pill/TestStatusPill'
import LoadingPage from '@/pages/system/LoadingPage'
import { getErrorMessage } from '@/shared/lib/axios'
import { formatUiDate } from '@/shared/lib/datetime/formatUiDate'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import { InfoCard } from '@/shared/ui/InfoCard/InfoCard'
import { labelFromDict } from '@/utils/dict'
import { ConfiguredButton } from '@/widgets/page/ConfiguredButton'

export default function TestsDetails() {
  const { id } = useParams<{ id: string }>()

  if (!id) return <AlertMessage type={AlertType.ERROR} message="Відсутній параметр id" />

  const {
    data: responseData,
    error: queryError,
    isLoading,
    isPending,
    isFetching,
    isFetched,
  } = testsService.getById(id)

  if (isLoading || isPending || isFetching) {
    return <LoadingPage />
  }

  if (queryError)
    return <AlertMessage type={AlertType.ERROR} message={getErrorMessage(queryError)} />

  if (!responseData && isFetched) {
    return <AlertMessage type={AlertType.WARNING} message="Дані не знайдені" />
  }

  const { moldingSandRecipe } = samplesFieldRegistry
  const {
    measurement1,
    measurement2,
    measurement3,
    selectedMeasurement1,
    selectedMeasurement2,
    meanMeasurement,
    differencePercent,
    lowerLimit,
    upperLimit,
    status,
    createdAt,
    type,
  } = testsResponseFieldRegistry
  const unit = testTypeToUnit(responseData.type)

  return (
    <>
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {/* --- Статус --- */}
        <InfoCard label={status.label.default}>
          <TestStatusPill status={responseData.status}>
            {labelFromDict(testsStatus, responseData.status)}
          </TestStatusPill>
        </InfoCard>

        {/* --- Рецепт суміші --- */}
        <InfoCard label={moldingSandRecipe.label.default}>
          <Link
            to={`/soil-lab/samples/${responseData.sample.id}`}
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            {labelFromDict(samplesMixtures, responseData.sample.moldingSandRecipe)}
          </Link>
        </InfoCard>

        {/* --- Тип випробування --- */}
        <InfoCard label={type.label.default}>
          {labelFromDict(testsType, responseData.type)}
        </InfoCard>

        {/* --- Дата створення --- */}
        <InfoCard label={createdAt.label.default}>{formatUiDate(responseData.createdAt)}</InfoCard>

        {/* --- Вимірювання --- */}
        <InfoCard label={measurement1.label.default}>
          {responseData.measurement1} {unit}
        </InfoCard>

        <InfoCard label={measurement2.label.default}>
          {responseData.measurement2} {unit}
        </InfoCard>

        {responseData.measurement3 !== null && responseData.measurement3 !== undefined && (
          <InfoCard label={measurement3.label.default}>
            {responseData.measurement3} {unit}
          </InfoCard>
        )}

        {/* --- Обрані виміри --- */}
        <InfoCard label={selectedMeasurement1.label.default}>
          {responseData.selectedMeasurement1} {unit}
        </InfoCard>

        <InfoCard label={selectedMeasurement2.label.default}>
          {responseData.selectedMeasurement2} {unit}
        </InfoCard>

        {/* --- Агрегати/межі --- */}
        <InfoCard label={meanMeasurement.label.default}>
          {responseData.meanMeasurement} {unit}
        </InfoCard>

        <InfoCard label={differencePercent.label.default}>
          {responseData.differencePercent}
        </InfoCard>

        <InfoCard label={lowerLimit.label.default}>
          {responseData.lowerLimit} {unit}
        </InfoCard>

        <InfoCard label={upperLimit.label.default}>
          {responseData.upperLimit} {unit}
        </InfoCard>
      </section>

      <div className="mt-2">
        <ConfiguredButton btnType="delete" disabled={isLoading} />
      </div>
    </>
  )
}
