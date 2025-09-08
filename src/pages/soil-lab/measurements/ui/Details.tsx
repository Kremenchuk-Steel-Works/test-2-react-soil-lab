import { useParams } from 'react-router-dom'
import { measurementsService } from '@/entities/soil-lab/measurements/api/service'
import { getErrorMessage } from '@/shared/lib/axios'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import { ConfiguredButton } from '@/widgets/page/ConfiguredButton'

export default function MeasurementsDetails() {
  const { id } = useParams<{ id: string }>()

  const {
    data: responseData,
    isLoading,
    error: queryError,
  } = measurementsService.getById(id!, {
    query: { enabled: !!id },
  })

  return (
    <>
      {queryError && <AlertMessage type={AlertType.ERROR} message={getErrorMessage(queryError)} />}
      {!isLoading && !queryError && responseData && (
        <>
          <h5 className="layout-text">Деталі</h5>

          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            {/* --- Номер суміші --- */}
            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">Номер суміші</dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">
                {responseData.moldingSandNumber}
              </dd>
            </div>

            {/* --- Міцність --- */}
            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">Міцність (кгс/см²)</dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">
                {responseData.moldingSandStrengthKgfCm2}
              </dd>
            </div>

            {/* --- Газопроникність --- */}
            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">
                Газопроникність (од.)
              </dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">
                {responseData.moldingSandGasPermeability}
              </dd>
            </div>

            {/* --- Вологість --- */}
            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">Вологість (%)</dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">
                {responseData.moldingSandMoisturePercent}
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

            {/* --- Час додавання --- */}
            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">Час додавання</dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">
                {new Date(responseData.createdAt).toLocaleString()}
              </dd>
            </div>
          </dl>

          <div>
            <ConfiguredButton btnType="delete" disabled={isLoading} />
          </div>
        </>
      )}
    </>
  )
}
