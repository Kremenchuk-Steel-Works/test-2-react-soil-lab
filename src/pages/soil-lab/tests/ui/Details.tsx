import { useParams } from 'react-router-dom'
import { testsService } from '@/entities/soil-lab/tests/api/service'
import { getErrorMessage } from '@/shared/lib/axios'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import { ConfiguredButton } from '@/widgets/page/ConfiguredButton'

export default function TestsDetails() {
  const { id } = useParams<{ id: string }>()

  const {
    data: responseData,
    isLoading,
    error: queryError,
  } = testsService.getById(id!, {
    query: { enabled: !!id },
  })

  return (
    <>
      {queryError && <AlertMessage type={AlertType.ERROR} message={getErrorMessage(queryError)} />}
      {!isLoading && !queryError && responseData && (
        <>
          <h5 className="layout-text">Деталі</h5>

          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            {/* --- ID випробування --- */}
            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">ID випробування</dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">{responseData.id}</dd>
            </div>

            {/* --- Тип випробування --- */}
            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">Тип</dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">{responseData.type}</dd>
            </div>

            {/* --- Зразок --- */}
            <div className="md:col-span-2">
              <dt className="font-medium text-gray-500 dark:text-slate-400">Зразок</dt>
              <dd className="mt-1 whitespace-pre-wrap text-gray-900 dark:text-slate-300">
                {typeof responseData.sample === 'object'
                  ? JSON.stringify(responseData.sample)
                  : String(responseData.sample)}
              </dd>
            </div>

            {/* --- Вимірювання 1 --- */}
            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">Вимірювання 1</dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">
                {responseData.measurement1}
              </dd>
            </div>

            {/* --- Вимірювання 2 --- */}
            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">Вимірювання 2</dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">
                {responseData.measurement2}
              </dd>
            </div>

            {/* --- Вимірювання 3 --- */}
            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">Вимірювання 3</dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">
                {typeof responseData.measurement3 === 'number'
                  ? responseData.measurement3
                  : JSON.stringify(responseData.measurement3)}
              </dd>
            </div>

            {/* --- Обраний вимір 1 --- */}
            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">Обраний вимір 1</dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">
                {responseData.selectedMeasurement1}
              </dd>
            </div>

            {/* --- Обраний вимір 2 --- */}
            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">Обраний вимір 2</dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">
                {responseData.selectedMeasurement2}
              </dd>
            </div>

            {/* --- Різниця (%) --- */}
            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">Різниця (%)</dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">
                {responseData.differencePercent}
              </dd>
            </div>

            {/* --- Середнє значення --- */}
            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">Середнє значення</dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">
                {responseData.meanMeasurement}
              </dd>
            </div>

            {/* --- Нижня межа --- */}
            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">Нижня межа</dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">{responseData.lowerLimit}</dd>
            </div>

            {/* --- Верхня межа --- */}
            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">Верхня межа</dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">{responseData.upperLimit}</dd>
            </div>

            {/* --- Статус --- */}
            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">Статус</dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">{responseData.status}</dd>
            </div>

            {/* --- Видалено --- */}
            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">Видалено</dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">
                {responseData.isDeleted ? 'Так' : 'Ні'}
              </dd>
            </div>

            {/* --- Час створення --- */}
            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">Час створення</dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">
                {new Date(responseData.createdAt).toLocaleString()}
              </dd>
            </div>

            {/* --- Хто створив (опційно) --- */}
            {responseData.createdById && (
              <div>
                <dt className="font-medium text-gray-500 dark:text-slate-400">Створив (ID)</dt>
                <dd className="mt-1 text-gray-900 dark:text-slate-300">
                  {responseData.createdById}
                </dd>
              </div>
            )}

            {/* --- Час оновлення --- */}
            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">Час оновлення</dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">
                {new Date(responseData.updatedAt).toLocaleString()}
              </dd>
            </div>

            {/* --- Хто оновив (опційно) --- */}
            {responseData.updatedById && (
              <div>
                <dt className="font-medium text-gray-500 dark:text-slate-400">Оновив (ID)</dt>
                <dd className="mt-1 text-gray-900 dark:text-slate-300">
                  {responseData.updatedById}
                </dd>
              </div>
            )}

            {/* --- Час видалення (опційно) --- */}
            {responseData.deletedAt != null && (
              <div className="md:col-span-2">
                <dt className="font-medium text-gray-500 dark:text-slate-400">Час видалення</dt>
                <dd className="mt-1 text-gray-900 dark:text-slate-300">
                  {typeof responseData.deletedAt === 'string'
                    ? new Date(responseData.deletedAt).toLocaleString()
                    : JSON.stringify(responseData.deletedAt)}
                </dd>
              </div>
            )}
          </dl>

          <div>
            <ConfiguredButton btnType="delete" disabled={isLoading} />
          </div>
        </>
      )}
    </>
  )
}
