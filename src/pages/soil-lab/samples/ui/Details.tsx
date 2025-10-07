import { ChevronRight } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { PageButtonType } from '@/app/routes/types'
import { samplesService } from '@/entities/soil-lab/samples/api/service'
import { samplesResponseFieldRegistry } from '@/entities/soil-lab/samples/model/fields-registry'
import { samplesMoldingSandRecipeLabels } from '@/entities/soil-lab/samples/model/moldingSandRecipe'
import { testTypeToUnit } from '@/entities/soil-lab/tests/lib/testTypeToUnit'
import { testsResponseFieldRegistry } from '@/entities/soil-lab/tests/model/fields-registry'
import { testsStatusLabels } from '@/entities/soil-lab/tests/model/status'
import { testsTypeLabels } from '@/entities/soil-lab/tests/model/type'
import { TestStatusPill } from '@/entities/soil-lab/tests/ui/status-pill/TestStatusPill'
import SamplesDeletePage from '@/pages/soil-lab/samples/ui/Delete'
import LoadingPage from '@/pages/system/LoadingPage'
import { getErrorMessage } from '@/shared/lib/axios'
import { formatUiDate } from '@/shared/lib/datetime/formatUiDate'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import { InfoCard } from '@/shared/ui/InfoCard/InfoCard'
import ModalTrigger from '@/shared/ui/modal/ModalTrigger'
import { labelFromDict } from '@/utils/dict'
import { ConfiguredButton } from '@/widgets/page/ConfiguredButton'

export default function SamplesDetailsPage() {
  const { id } = useParams<{ id: string }>()

  if (!id) return <AlertMessage type={AlertType.ERROR} message="Відсутній параметр id" />

  const {
    data: responseData,
    error: queryError,
    isLoading,
    isPending,
    isFetched,
  } = samplesService.getById(id)

  if (isLoading || isPending) {
    return <LoadingPage />
  }

  if (queryError)
    return <AlertMessage type={AlertType.ERROR} message={getErrorMessage(queryError)} />

  if (!responseData && isFetched) {
    return <AlertMessage type={AlertType.WARNING} message="Дані не знайдені" />
  }

  const { moldingSandRecipe, note, receivedAt, tests } = samplesResponseFieldRegistry
  const { meanMeasurement } = testsResponseFieldRegistry

  return (
    <>
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <InfoCard label={moldingSandRecipe.label.default}>
          {labelFromDict(samplesMoldingSandRecipeLabels, responseData.moldingSandRecipe)}
        </InfoCard>

        <InfoCard label={receivedAt.label.default}>
          {formatUiDate(responseData.receivedAt)}
        </InfoCard>

        {(responseData.note ?? '') !== '' && (
          <InfoCard label={note.label.default} className="sm:col-span-2 xl:col-span-3">
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
            {tests.label.default}
          </h6>

          <ul role="list" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {responseData.tests.map((test) => {
              const typeLabel = labelFromDict(testsTypeLabels, test.type)
              const statusLabel = labelFromDict(testsStatusLabels, test.status)
              const unit = testTypeToUnit(test.type)

              return (
                <li key={test.id}>
                  <Link
                    to={`/soil-lab/tests/${test.id}`}
                    className="group block rounded-xl border border-slate-200 bg-white/60 p-3 shadow-sm transition hover:shadow focus:ring-2 focus:ring-blue-500 focus:outline-none sm:p-4 dark:border-slate-700 dark:bg-slate-800/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h6 className="font-medium text-slate-900 transition group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-300">
                        {typeLabel}
                      </h6>

                      <div className="shrink-0 whitespace-nowrap">
                        <TestStatusPill status={test.status}>{statusLabel}</TestStatusPill>
                      </div>
                    </div>

                    <div className="mt-2 text-base text-slate-500 dark:text-slate-400">
                      {meanMeasurement.label.default}
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
        <ModalTrigger
          trigger={(open) => (
            <ConfiguredButton btnType={PageButtonType.delete} onClick={open} disabled={isLoading} />
          )}
          sheetProps={{
            label: <h5 className="layout-text">Видалення</h5>,
          }}
        >
          {() => <SamplesDeletePage />}
        </ModalTrigger>
      </div>
    </>
  )
}
