import { useParams } from 'react-router-dom'
import { samplesService } from '@/entities/soil-lab/samples/api/service'
import { getErrorMessage } from '@/shared/lib/axios'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import { ConfiguredButton } from '@/widgets/page/ConfiguredButton'

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

            {/* --- Примітка (опційно) --- */}
            {(responseData.note ?? '') !== '' && (
              <div className="md:col-span-2">
                <dt className="font-medium text-gray-500 dark:text-slate-400">Примітка</dt>
                <dd className="mt-1 whitespace-pre-wrap text-gray-900 dark:text-slate-300">
                  {responseData.note}
                </dd>
              </div>
            )}

            {/* --- Статус --- */}
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

            {/* --- Оновлено --- */}
            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">Оновлено</dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">
                {new Date(responseData.updatedAt).toLocaleString()}
              </dd>
            </div>

            {/* --- Хто створив (опційно) --- */}
            {responseData.createdById && (
              <div>
                <dt className="font-medium text-gray-500 dark:text-slate-400">Хто створив</dt>
                <dd className="mt-1 text-gray-900 dark:text-slate-300">
                  {responseData.createdById}
                </dd>
              </div>
            )}

            {/* --- Хто оновив (опційно) --- */}
            {responseData.updatedById && (
              <div>
                <dt className="font-medium text-gray-500 dark:text-slate-400">Хто оновив</dt>
                <dd className="mt-1 text-gray-900 dark:text-slate-300">
                  {responseData.updatedById}
                </dd>
              </div>
            )}

            {/* --- Час видалення (опційно) --- */}
            {responseData.deletedAt && (
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
