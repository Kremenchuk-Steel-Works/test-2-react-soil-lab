import { useParams } from 'react-router-dom'
import { samplesMixtures } from '@/entities/soil-lab/samples/model/mixtures'
import { testsService } from '@/entities/soil-lab/tests/api/service'
import { testTypeToUnit } from '@/entities/soil-lab/tests/lib/testTypeToUnit'
import { testsStatus } from '@/entities/soil-lab/tests/model/status'
import { testsType } from '@/entities/soil-lab/tests/model/type'
import LoadingPage from '@/pages/system/LoadingPage'
import { TestStatus } from '@/shared/api/soil-lab/model'
import { getErrorMessage } from '@/shared/lib/axios'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
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
      <h5 className="layout-text">Деталі</h5>

      {/* --- Статус (перекладений) --- */}
      <div>
        <dd className="inline-flex align-middle text-gray-900 dark:text-slate-300">
          {responseData.status === TestStatus.passed ? (
            <AlertMessage
              type={AlertType.SUCCESS}
              message={`${labelFromDict(testsStatus, responseData.status)}`}
            />
          ) : (
            <AlertMessage
              type={AlertType.WARNING}
              message={`${labelFromDict(testsStatus, responseData.status)}`}
            />
          )}
        </dd>
      </div>

      <dl className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
        {/* --- Рецепт суміші --- */}
        <div>
          <dt className="font-medium text-gray-500 dark:text-slate-400">Рецепт суміші</dt>
          <dd className="mt-1 text-gray-900 dark:text-slate-300">
            <a
              href={`/soil-lab/samples/${responseData.sample.id}`}
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              {labelFromDict(samplesMixtures, responseData.sample.moldingSandRecipe)}
            </a>
          </dd>
        </div>

        {/* --- Тип випробування (перекладений) --- */}
        <div>
          <dt className="font-medium text-gray-500 dark:text-slate-400">Тип</dt>
          <dd className="mt-1 text-gray-900 dark:text-slate-300">
            {labelFromDict(testsType, responseData?.type)}
          </dd>
        </div>
        {/* --- Дата створення --- */}
        <div>
          <dt className="font-medium text-gray-500 dark:text-slate-400">Дата створення</dt>
          <dd className="mt-1 text-gray-900 dark:text-slate-300">
            {new Date(responseData.createdAt).toLocaleString()}
          </dd>
        </div>

        {/* --- Вимірювання 1 --- */}
        <div>
          <dt className="font-medium text-gray-500 dark:text-slate-400">Вимірювання 1</dt>
          <dd className="mt-1 text-gray-900 dark:text-slate-300">
            {responseData.measurement1} {unit}
          </dd>
        </div>
        {/* --- Вимірювання 2 --- */}
        <div>
          <dt className="font-medium text-gray-500 dark:text-slate-400">Вимірювання 2</dt>
          <dd className="mt-1 text-gray-900 dark:text-slate-300">
            {responseData.measurement2} {unit}
          </dd>
        </div>

        {/* --- Вимірювання 3 --- */}
        {responseData.measurement3 && (
          <div>
            <dt className="font-medium text-gray-500 dark:text-slate-400">Вимірювання 3</dt>
            <dd className="mt-1 text-gray-900 dark:text-slate-300">
              {responseData.measurement3} {unit}
            </dd>
          </div>
        )}

        {/* --- Обраний вимір 1 --- */}
        <div>
          <dt className="font-medium text-gray-500 dark:text-slate-400">Обраний вимір 1</dt>
          <dd className="mt-1 text-gray-900 dark:text-slate-300">
            {responseData.selectedMeasurement1} {unit}
          </dd>
        </div>
        {/* --- Обраний вимір 2 --- */}
        <div>
          <dt className="font-medium text-gray-500 dark:text-slate-400">Обраний вимір 2</dt>
          <dd className="mt-1 text-gray-900 dark:text-slate-300">
            {responseData.selectedMeasurement2} {unit}
          </dd>
        </div>
        {/* --- Середнє значення --- */}
        <div>
          <dt className="font-medium text-gray-500 dark:text-slate-400">Середнє значення</dt>
          <dd className="mt-1 text-gray-900 dark:text-slate-300">
            {responseData.meanMeasurement} {unit}
          </dd>
        </div>
        {/* --- Різниця (%) --- */}
        <div>
          <dt className="font-medium text-gray-500 dark:text-slate-400">Різниця (%)</dt>
          <dd className="mt-1 text-gray-900 dark:text-slate-300">
            {responseData.differencePercent}
          </dd>
        </div>
        {/* --- Нижня межа --- */}
        <div>
          <dt className="font-medium text-gray-500 dark:text-slate-400">Нижня межа</dt>
          <dd className="mt-1 text-gray-900 dark:text-slate-300">
            {responseData.lowerLimit} {unit}
          </dd>
        </div>
        {/* --- Верхня межа --- */}
        <div>
          <dt className="font-medium text-gray-500 dark:text-slate-400">Верхня межа</dt>
          <dd className="mt-1 text-gray-900 dark:text-slate-300">
            {responseData.upperLimit} {unit}
          </dd>
        </div>
      </dl>

      <div>
        <ConfiguredButton btnType="delete" disabled={isLoading} />
      </div>
    </>
  )
}
