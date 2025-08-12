import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import {
  moldPassportService,
  moldPassportStatusOptions,
} from '@/entities/molding-shop/mold-passport'
import { getErrorMessage } from '@/shared/lib/axios'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'

export default function MoldPassportDetails() {
  const { id } = useParams<{ id: string }>()

  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery({
    ...moldPassportService.getById(id!),
    placeholderData: keepPreviousData,
    enabled: !!id,
  })

  return (
    <>
      {isError && <AlertMessage type={AlertType.ERROR} message={getErrorMessage(queryError)} />}
      {!isLoading && !isError && data && (
        <>
          <h4 className="layout-text">Деталі</h4>

          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 text-sm md:grid-cols-2">
            {/* --- Основна інформація --- */}
            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">ID</dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">{data.id}</dd>
            </div>

            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">Референс-код</dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">{data.referenceCode}</dd>
            </div>

            <div className="md:col-span-2">
              <dt className="font-medium text-gray-500 dark:text-slate-400">
                Основна назва виливка
              </dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">
                {data.primaryCastingProductName}
              </dd>
            </div>

            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">Статус</dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">
                {moldPassportStatusOptions.find((option) => option.value === data.status)?.label ??
                  data.status}
              </dd>
            </div>

            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">Паспорт завершено</dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">
                {data.isComplete ? 'Так' : 'Ні'}
              </dd>
            </div>

            {/* --- Технологія та дільниця --- */}
            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">Дільниця формування</dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">{data.moldingArea.name}</dd>
            </div>

            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">Технологія лиття</dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">
                {data.castingTechnology.name} ({data.castingTechnology.abbreviation})
              </dd>
            </div>

            {/* --- Обладнання --- */}
            {data.patternPlateFrame && (
              <div>
                <dt className="font-medium text-gray-500 dark:text-slate-400">Модельна плита</dt>
                <dd className="mt-1 text-gray-900 dark:text-slate-300">
                  {data.patternPlateFrame.serialNumber} (креслення:{' '}
                  {data.patternPlateFrame.blueprintNumber})
                </dd>
              </div>
            )}

            {data.moldingFlask && (
              <div>
                <dt className="font-medium text-gray-500 dark:text-slate-400">Опока</dt>
                <dd className="mt-1 text-gray-900 dark:text-slate-300">
                  {data.moldingFlask.serialNumber} (креслення: {data.moldingFlask.blueprintNumber})
                </dd>
              </div>
            )}

            {/* --- Технологічні дані ПГС (якщо є) --- */}
            {data.dataGsc && (
              <div className="mt-4 border-t border-gray-200 pt-4 md:col-span-2 dark:border-slate-700">
                <dt className="font-medium text-gray-500 dark:text-slate-400">Дані ПГС</dt>
                <dd className="mt-2 space-y-2 text-gray-900 dark:text-slate-300">
                  <div>Тип суміші: {data.dataGsc.moldingSandType.name}</div>
                  <div>
                    Система суміші:{' '}
                    {data.dataGsc.moldingSandSystem === 'layered' ? 'Двошарова' : 'Єдина'}
                  </div>
                  <div>
                    Щільність (гориз./верт.): {data.dataGsc.moldHorizontalDensity} /{' '}
                    {data.dataGsc.moldVerticalDensity}
                  </div>
                </dd>
              </div>
            )}

            {/* --- Технологічні дані ХТС (якщо є) --- */}
            {data.dataAsc && (
              <div className="mt-4 border-t border-gray-200 pt-4 md:col-span-2 dark:border-slate-700">
                <dt className="font-medium text-gray-500 dark:text-slate-400">Дані ХТС</dt>
                <dd className="mt-2 space-y-2 text-gray-900 dark:text-slate-300">
                  <div>Тип суміші: {data.dataAsc.moldingSandType.name}</div>
                  <div>Твердість форми: {data.dataAsc.moldHardness}</div>
                  {data.dataAsc.resin && <div>Смола: {data.dataAsc.resin.name}</div>}
                </dd>
              </div>
            )}

            {/* --- Додаткові параметри --- */}
            {data.pressingPressure !== null && (
              <div>
                <dt className="font-medium text-gray-500 dark:text-slate-400">Тиск пресування</dt>
                <dd className="mt-1 text-gray-900 dark:text-slate-300">{data.pressingPressure}</dd>
              </div>
            )}

            {data.sequenceInShift !== null && (
              <div>
                <dt className="font-medium text-gray-500 dark:text-slate-400">
                  Номер форми у зміні
                </dt>
                <dd className="mt-1 text-gray-900 dark:text-slate-300">{data.sequenceInShift}</dd>
              </div>
            )}

            {data.assemblyTimestamp && (
              <div>
                <dt className="font-medium text-gray-500 dark:text-slate-400">
                  Час збирання форми
                </dt>
                <dd className="mt-1 text-gray-900 dark:text-slate-300">
                  {new Date(data.assemblyTimestamp).toLocaleString()}
                </dd>
              </div>
            )}

            {data.notes && (
              <div className="md:col-span-2">
                <dt className="font-medium text-gray-500 dark:text-slate-400">Примітки</dt>
                <dd className="mt-1 text-gray-900 dark:text-slate-300">{data.notes}</dd>
              </div>
            )}

            {/* --- Порожнини форми --- */}
            {data.moldCavities.map((cavity, index) => (
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
                      <p className="font-medium text-gray-600 dark:text-slate-400">Стержні:</p>
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
                {new Date(data.createdAt).toLocaleString()}
              </dd>
            </div>

            <div>
              <dt className="font-medium text-gray-500 dark:text-slate-400">Оновлено</dt>
              <dd className="mt-1 text-gray-900 dark:text-slate-300">
                {new Date(data.updatedAt).toLocaleString()}
              </dd>
            </div>
          </dl>
        </>
      )}
    </>
  )
}
