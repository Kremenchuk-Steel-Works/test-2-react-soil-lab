import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPathByKey } from '@/app/routes/utils/utils'
import { samplesService } from '@/entities/soil-lab/samples/api/service'
import { samplesFieldRegistry } from '@/entities/soil-lab/samples/model/fields-registry'
import { testTypeToUnit } from '@/entities/soil-lab/tests/lib/testTypeToUnit'
import { testsFieldRegistry } from '@/entities/soil-lab/tests/model/fields-registry'
import { testsTypeLabels } from '@/entities/soil-lab/tests/model/type'
import { testsDynamicSections } from '@/entities/soil-lab/tests/ui/form/lib/dynamic-sections'
import {
  testsCreateFormSchema,
  type TestsCreateFormFields,
} from '@/features/soil-lab/tests/create/model/schema'
import TestsCreate from '@/features/soil-lab/tests/create/ui/TestsCreate'
import LoadingPage from '@/pages/system/LoadingPage'
import type { CreateTestApiV1TestsPostMutationResult } from '@/shared/api/soil-lab/endpoints/tests/tests'
import { TestStatus, TestType } from '@/shared/api/soil-lab/model'
import { getErrorMessage } from '@/shared/lib/axios'
import { createDynamicEngine } from '@/shared/lib/zod/dynamic-resolver'
import { selectCandidatesFromTree } from '@/shared/lib/zod/dynamic-sections-scoped'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import { FormLayout } from '@/shared/ui/react-hook-form/FormLayout'
import { dictTypedKeys } from '@/utils/dict'

type AlertState = { type: AlertType; message: string } | null

function statusToAlert(res: CreateTestApiV1TestsPostMutationResult): AlertState {
  const unit = testTypeToUnit(res.type)
  const result = `${res.meanMeasurement} ${unit}`
  const range = `від ${res.lowerLimit} до ${res.upperLimit} ${unit}`
  switch (res.status) {
    case TestStatus.passed:
      return {
        type: AlertType.SUCCESS,
        message: `Пройдено, результат: ${result}. Норма: ${range}`,
      }
    case TestStatus.failed:
      return {
        type: AlertType.WARNING,
        message: `Провалено, результат: ${result}. Норма: ${range}`,
      }
    default:
      return null
  }
}

export default function TestsAddPage() {
  const { id } = useParams<{ id: string }>()
  const [alerts, setAlerts] = useState<Partial<Record<TestType, AlertState>>>({})

  // фабрика обработчика успеха для конкретного типа теста
  const onSuccess = useCallback(
    (type: TestType) => (res: CreateTestApiV1TestsPostMutationResult) => {
      const next = statusToAlert(res)
      setAlerts((prev) => ({
        ...prev,
        [type]: next ?? { type: AlertType.SUCCESS, message: 'Створено, статус невідомий' },
      }))
    },
    [],
  )

  const navigate = useNavigate()
  const redirectedRef = useRef(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Готовим normalizer для корректной проверки условий (совпадает с тем, что в форме)
  const { valueNormalizer } = useMemo(
    () => createDynamicEngine<TestsCreateFormFields>(testsCreateFormSchema, testsDynamicSections),
    [],
  )

  // Получаем sample один раз на уровне страницы
  const {
    data: responseData,
    error: queryError,
    isLoading,
    isPending,
    isFetching,
    isFetched,
  } = samplesService.getById(id!, {
    query: { enabled: Boolean(id) },
  })

  const { moldingSandRecipe } = samplesFieldRegistry
  const { type, measurement1 } = testsFieldRegistry

  // Все типы тестов
  const testKeys = dictTypedKeys(testsTypeLabels)

  // Отфильтрованные "активные" типы для текущего sample
  const activeTestKeys = useMemo(() => {
    // пока нет данных — ничего не показываем
    if (!responseData) return []
    const base = { [moldingSandRecipe.key]: responseData.moldingSandRecipe } as Record<
      string,
      unknown
    >

    return testKeys.filter((t) => {
      const values = { ...base, [type.key]: t }
      const candidates = selectCandidatesFromTree(testsDynamicSections, values, valueNormalizer)
      // Активна, если есть правило для секции measurement1
      return candidates?.some((c) => c.section === measurement1.key) ?? false
    })
  }, [measurement1.key, moldingSandRecipe.key, type.key, responseData, testKeys, valueNormalizer])

  const allDone = useMemo(
    () => activeTestKeys.length > 0 && activeTestKeys.every((t) => alerts[t] !== undefined),
    [alerts, activeTestKeys],
  )

  // Редиректим пользователя когда выполнены ВСЕ активные формы
  useEffect(() => {
    if (allDone && !redirectedRef.current) {
      redirectedRef.current = true
      timeoutRef.current = setTimeout(() => {
        void navigate(getPathByKey('samplesAdd'))
      }, 1000)
    }
    return () => {
      if (timeoutRef.current !== null) clearTimeout(timeoutRef.current)
    }
  }, [allDone, navigate])

  if (!id) return <AlertMessage type={AlertType.ERROR} message="Відсутній параметр id" />

  if (isLoading || isPending || isFetching) {
    return <LoadingPage />
  }

  if (queryError)
    return <AlertMessage type={AlertType.ERROR} message={getErrorMessage(queryError)} />

  if (!responseData && isFetched) {
    return <AlertMessage type={AlertType.WARNING} message="Дані не знайдені" />
  }

  return (
    <div className="flex flex-wrap gap-x-2 gap-y-2">
      {activeTestKeys.map((testType) => (
        <div key={testType} className="w-full">
          <TestsCreate id={id} type={testType} onSuccess={onSuccess(testType)} />

          <FormLayout as="div">
            {alerts[testType] && (
              <AlertMessage type={alerts[testType].type} message={alerts[testType].message} />
            )}
          </FormLayout>
        </div>
      ))}
    </div>
  )
}
