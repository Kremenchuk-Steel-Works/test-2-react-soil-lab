import { useParams } from 'react-router-dom'
import {
  moldPassportService,
  moldPassportStatusOptions,
} from '@/entities/molding-shop-update/mold-passport'
import { getErrorMessage } from '@/shared/lib/axios'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import { ConfiguredButton } from '@/widgets/page/ConfiguredButton'

export default function MoldPassportDetails() {
  const { id } = useParams<{ id: string }>()

  const {
    data: responseData,
    isLoading,
    error: queryError,
  } = moldPassportService.getById(id!, {
    query: { enabled: !!id },
  })

  return (
    <>
      {queryError && <AlertMessage type={AlertType.ERROR} message={getErrorMessage(queryError)} />}
      {!isLoading && !queryError && responseData && (
        <>
          <h5 className="layout-text">Деталі</h5>

          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            {/* --- Основна інформація --- */}
            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">ID</dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">{responseData.id}</dd>
            </div>

            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">Референс-код</dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">
                {responseData.referenceCode}
              </dd>
            </div>

            <div className="md:col-span-2">
              <dt className="font-medium text-gray-500 dark:text-slate-400">
                Основна назва виливка
              </dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">
                {responseData.primaryCastingProductName}
              </dd>
            </div>

            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">Статус</dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">
                {moldPassportStatusOptions.find((option) => option.value === responseData.status)
                  ?.label ?? responseData.status}
              </dd>
            </div>

            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">Паспорт завершено</dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">
                {responseData.isComplete ? 'Так' : 'Ні'}
              </dd>
            </div>

            {/* --- Технологія та дільниця --- */}
            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">Дільниця формування</dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">
                {responseData.moldingArea.name}
              </dd>
            </div>

            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">Технологія лиття</dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">
                {responseData.castingTechnology.name} ({responseData.castingTechnology.abbreviation}
                )
              </dd>
            </div>

            {/* --- Обладнання --- */}
            {responseData.patternPlateFrame && (
              <div>
                <dt className="font-medium text-gray-500 dark:text-slate-400">Модельна плита</dt>
                <dd className="mt-1 text-gray-900 dark:text-slate-300">
                  {responseData.patternPlateFrame.serialNumber} (креслення:{' '}
                  {responseData.patternPlateFrame.blueprintNumber})
                </dd>
              </div>
            )}

            {responseData.moldingFlask && (
              <div>
                <dt className="font-medium text-gray-500 dark:text-slate-400">Опока</dt>
                <dd className="mt-1 text-gray-900 dark:text-slate-300">
                  {responseData.moldingFlask.serialNumber} (креслення:{' '}
                  {responseData.moldingFlask.blueprintNumber})
                </dd>
              </div>
            )}

            {/* --- Технологічні дані ПГС (якщо є) --- */}
            {responseData.dataGsc && (
              <div className="mt-4 border-t border-gray-200 pt-4 md:col-span-2 dark:border-slate-700">
                <dt className="font-medium text-gray-500 dark:text-slate-400">Дані ПГС</dt>
                <dd className="mt-2 space-y-2 text-gray-900 dark:text-slate-300">
                  <div>Тип суміші: {responseData.dataGsc.moldingSandType.name}</div>
                  <div>
                    Система суміші:{' '}
                    {responseData.dataGsc.moldingSandSystem === 'layered' ? 'Двошарова' : 'Єдина'}
                  </div>
                  <div>
                    Щільність (гориз./верт.): {responseData.dataGsc.moldHorizontalDensity} /{' '}
                    {responseData.dataGsc.moldVerticalDensity}
                  </div>
                </dd>
              </div>
            )}

            {/* --- Технологічні дані ХТС (якщо є) --- */}
            {responseData.dataAsc && (
              <div className="mt-4 border-t border-gray-200 pt-4 md:col-span-2 dark:border-slate-700">
                <dt className="font-medium text-gray-500 dark:text-slate-400">Дані ХТС</dt>
                <dd className="mt-2 space-y-2 text-gray-900 dark:text-slate-300">
                  <div>Тип суміші: {responseData.dataAsc.moldingSandType.name}</div>
                  <div>Твердість форми: {responseData.dataAsc.moldHardness}</div>
                  {responseData.dataAsc.resin && (
                    <div>Смола: {responseData.dataAsc.resin.name}</div>
                  )}
                </dd>
              </div>
            )}

            {/* --- Додаткові параметри --- */}
            {responseData.pressingPressure !== null && (
              <div>
                <dt className="font-medium text-gray-500 dark:text-slate-400">Тиск пресування</dt>
                <dd className="mt-1 text-gray-900 dark:text-slate-300">
                  {responseData.pressingPressure}
                </dd>
              </div>
            )}

            {responseData.sequenceInShift !== null && (
              <div>
                <dt className="font-medium text-gray-500 dark:text-slate-400">
                  Номер форми у зміні
                </dt>
                <dd className="mt-1 text-gray-900 dark:text-slate-300">
                  {responseData.sequenceInShift}
                </dd>
              </div>
            )}

            {responseData.assemblyTimestamp && (
              <div>
                <dt className="font-medium text-gray-500 dark:text-slate-400">
                  Час збирання форми
                </dt>
                <dd className="mt-1 text-gray-900 dark:text-slate-300">
                  {new Date(responseData.assemblyTimestamp).toLocaleString()}
                </dd>
              </div>
            )}

            {responseData.notes && (
              <div className="md:col-span-2">
                <dt className="font-medium text-gray-500 dark:text-slate-400">Примітки</dt>
                <dd className="mt-1 text-gray-900 dark:text-slate-300">{responseData.notes}</dd>
              </div>
            )}

            {/* --- Порожнини форми --- */}
            {responseData.moldCavities.map((cavity, index) => (
              <div
                key={cavity.id}
                className="mt-4 border-t border-gray-200 pt-4 md:col-span-2 dark:border-slate-700"
              >
                <dt className="font-medium text-gray-900 dark:text-slate-200">
                  Порожнина форми #{index + 1} (SN: {cavity.serialNumber})
                </dt>
                <dd className="mt-2 space-y-2 text-gray-900 dark:text-slate-300">
                  <div>Виливок: {cavity.castingPattern.castingProduct.name}</div>
                  <div>Функціональна: {cavity.isFunctional ? 'Так' : 'Ні'}</div>
                  {cavity.moldCores.length > 0 && (
                    <div className="pl-4">
                      <p className="font-medium text-gray-600 dark:text-slate-400">Стрижні:</p>
                      <ul className="mt-1 list-inside list-disc space-y-1">
                        {cavity.moldCores.map((core) => (
                          <li key={core.id}>
                            Партія: {core.coreBatch.moldCoreType.modelNumber}, Твердість:{' '}
                            {core.hardness}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </dd>
              </div>
            ))}

            {/* --- Службова інформація --- */}
            <div className="mt-4 border-t border-gray-200 pt-4 md:col-span-2 dark:border-slate-700" />
            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">Створено</dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">
                {new Date(responseData.createdAt).toLocaleString()}
              </dd>
            </div>

            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">Оновлено</dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">
                {new Date(responseData.updatedAt).toLocaleString()}
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
