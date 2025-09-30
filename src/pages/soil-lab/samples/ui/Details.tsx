import { AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { samplesService } from '@/entities/soil-lab/samples/api/service'
import { samplesMixtures } from '@/entities/soil-lab/samples/model/mixtures'
import { testTypeToUnit } from '@/entities/soil-lab/tests/lib/testTypeToUnit'
import { testsStatus } from '@/entities/soil-lab/tests/model/status'
import { testsType } from '@/entities/soil-lab/tests/model/type'
import { TestStatus } from '@/shared/api/soil-lab/model'
import { getErrorMessage } from '@/shared/lib/axios'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import { InfoCard } from '@/shared/ui/InfoCard/InfoCard'
import { labelFromDict } from '@/utils/dict'
import { ConfiguredButton } from '@/widgets/page/ConfiguredButton'

const statusUI = (status: TestStatus, label: string) => {
  switch (status) {
    case TestStatus.passed:
      return {
        icon: <CheckCircle className="h-4 w-4" strokeWidth={1.6} />,
        pill:
          'bg-green-50 text-green-700 border border-green-300 ' +
          'dark:bg-green-950 dark:text-green-300 dark:border-green-700',
        label,
      }
    case TestStatus.failed:
      return {
        icon: <AlertTriangle className="h-4 w-4" strokeWidth={1.6} />,
        pill:
          'bg-yellow-50 text-yellow-800 border border-yellow-400/70 ' +
          'dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-600',
        label,
      }
    default:
      return {
        icon: <CheckCircle className="h-4 w-4" strokeWidth={1.6} />,
        pill:
          'bg-slate-100 text-slate-700 border border-slate-300 ' +
          'dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600',
        label,
      }
  }
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

          {/* Карточки с полями */}
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <InfoCard label="Рецепт суміші">
              {labelFromDict(samplesMixtures, responseData.moldingSandRecipe)}
            </InfoCard>

            <InfoCard label="Дата отримання зразка">
              {new Date(responseData.receivedAt).toLocaleString()}
            </InfoCard>

            {(responseData.note ?? '') !== '' && (
              <InfoCard label="Примітка" className="sm:col-span-2 xl:col-span-3">
                <p className="whitespace-pre-wrap text-slate-900 dark:text-slate-100">
                  {responseData.note}
                </p>
              </InfoCard>
            )}
          </section>

          {/* Перелік випробувань */}
          {responseData.tests.length > 0 && (
            <section className="mt-2">
              <h6 className="mb-2 text-base font-medium text-gray-500 dark:text-slate-400">
                Перелік випробувань
              </h6>

              <ul role="list" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {responseData.tests.map((test) => {
                  const typeLabel = labelFromDict(testsType, test.type)
                  const statusLabel = labelFromDict(testsStatus, test.status)
                  const unit = testTypeToUnit(test.type)
                  const s = statusUI(test.status, statusLabel)

                  return (
                    <li key={test.id}>
                      <Link
                        to={`/soil-lab/tests/${test.id}`}
                        className="group block rounded-xl border border-slate-200 bg-white/60 p-3 shadow-sm transition hover:shadow focus:ring-2 focus:ring-blue-500 focus:outline-none sm:p-4 dark:border-slate-700 dark:bg-slate-800/40"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h6 className="font-medium text-slate-900 transition group-hover:text-blue-600 dark:text-slate-100">
                            {typeLabel}
                          </h6>

                          <span
                            className={
                              'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-base font-medium' +
                              s.pill
                            }
                          >
                            {s.icon}
                            <span>{s.label}</span>
                          </span>
                        </div>

                        <div className="mt-2 text-base text-slate-500 dark:text-slate-400">
                          Середнє значення
                        </div>
                        <div className="mt-0.5 text-base font-semibold text-slate-900 dark:text-slate-100">
                          {test.meanMeasurement} {unit}
                        </div>

                        <div className="mt-3 hidden items-center text-base text-slate-400 sm:flex">
                          Дивитися деталі
                          <ChevronRight className="ml-1 h-3.5 w-3.5" />
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </section>
          )}

          <div className="mt-2">
            <ConfiguredButton btnType="delete" disabled={isLoading} />
          </div>
        </>
      )}
    </>
  )
}
