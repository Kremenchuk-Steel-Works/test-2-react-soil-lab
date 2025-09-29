import { useParams } from 'react-router-dom'
import { samplesService } from '@/entities/soil-lab/samples/api/service'
import { testsStatusOptions } from '@/entities/soil-lab/tests/model/status'
import { testsTypeOptions } from '@/entities/soil-lab/tests/model/type'
import type { TestStatus, TestType } from '@/shared/api/soil-lab/model'
import { getErrorMessage } from '@/shared/lib/axios'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import type { Option } from '@/shared/ui/select/ReactSelect'
import { ConfiguredButton } from '@/widgets/page/ConfiguredButton'

function getOptionLabel<T extends string>(
  opts: ReadonlyArray<Option<T>>,
  value: T,
  fallback: string = value,
): string {
  return opts.find((o) => o.value === value)?.label ?? fallback
}

export default function SamplesDetails() {
  const { id } = useParams<{ id: string }>()

  const {
    data: responseData,
    isLoading,
    error: queryError,
  } = samplesService.getById(id!, {
    query: { enabled: !!id },
  })

  return (
    <>
      {queryError && <AlertMessage type={AlertType.ERROR} message={getErrorMessage(queryError)} />}
      {!isLoading && !queryError && responseData && (
        <>
          <h5 className="layout-text">Деталі</h5>

          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            {/* --- Рецепт суміші --- */}
            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">Рецепт суміші</dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">
                {responseData.moldingSandRecipe}
              </dd>
            </div>

            {/* --- Дата отримання зразка --- */}
            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">
                Дата отримання зразка
              </dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">
                {new Date(responseData.receivedAt).toLocaleString()}
              </dd>
            </div>

            {/* --- Кількість випробувань --- */}
            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">
                Кількість випробувань
              </dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">
                {responseData.tests.length}
              </dd>
            </div>

            {/* --- ID зразка --- */}
            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">ID зразка</dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">{responseData.id}</dd>
            </div>

            {/* --- Перелік випробувань (детально з посиланнями) --- */}
            <div className="md:col-span-2">
              <dt className="font-medium text-gray-500 dark:text-slate-400">Перелік випробувань</dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">
                {responseData.tests.length === 0 ? (
                  <span className="text-gray-500 dark:text-slate-400">Немає</span>
                ) : (
                  <ul className="divide-y divide-gray-200 dark:divide-slate-700">
                    {responseData.tests.map((test) => {
                      const typeLabel = getOptionLabel<TestType>(testsTypeOptions, test.type)
                      const statusLabel = getOptionLabel<TestStatus>(
                        testsStatusOptions,
                        test.status,
                      )
                      return (
                        <li key={test.id} className="py-2">
                          <a
                            href={`../tests/${test.id}`}
                            className="text-blue-600 hover:underline dark:text-blue-400"
                          >
                            {typeLabel}
                          </a>
                          <span className="ml-2 text-gray-500 dark:text-slate-400">•</span>
                          <span className="ml-2">
                            Середнє значення:{' '}
                            <span className="font-medium">{test.meanMeasurement}</span>
                          </span>
                          <span className="ml-2 text-gray-500 dark:text-slate-400">•</span>
                          <span className="ml-2">
                            Статус: <span className="font-medium">{statusLabel}</span>
                          </span>
                          <span className="ml-2 text-gray-500 dark:text-slate-400">•</span>
                          <span className="ml-2">
                            ID: <span className="font-mono">{test.id}</span>
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </dd>
            </div>

            {/* --- Примітка (опційно) --- */}
            {(responseData.note ?? '') !== '' && (
              <div className="md:col-span-2">
                <dt className="font-medium text-gray-500 dark:text-slate-400">Примітка</dt>
                <dd className="mt-1 whitespace-pre-wrap text-gray-900 dark:text-slate-300">
                  {responseData.note}
                </dd>
              </div>
            )}

            {/* --- Статус зразка --- */}
            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">Статус</dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">
                {responseData.isDeleted ? 'Видалено' : 'Активний'}
              </dd>
            </div>

            {/* --- Час створення --- */}
            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">Час створення</dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">
                {new Date(responseData.createdAt).toLocaleString()}
              </dd>
            </div>

            {/* --- Створив (ID) --- */}
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

            {/* --- Оновив (ID) --- */}
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
              <div>
                <dt className="font-medium text-gray-500 dark:text-slate-400">Час видалення</dt>
                <dd className="mt-1 text-gray-900 dark:text-slate-300">
                  {new Date(responseData.deletedAt).toLocaleString()}
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
