import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getPathByKey } from '@/app/routes/utils/utils'
import { testTypeToUnit } from '@/entities/soil-lab/tests/lib/testTypeToUnit'
import { testsType } from '@/entities/soil-lab/tests/model/type'
import TestsCreate from '@/features/soil-lab/tests/create/ui/TestsCreate'
import type { CreateTestApiV1TestsPostMutationResult } from '@/shared/api/soil-lab/endpoints/tests/tests'
import { TestStatus, TestType } from '@/shared/api/soil-lab/model'
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

  const testKeys = dictTypedKeys(testsType)
  const allDone = useMemo(() => testKeys.every((t) => alerts[t] !== undefined), [alerts, testKeys])
  const navigate = useNavigate()

  const redirectedRef = useRef(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (allDone && !redirectedRef.current) {
      redirectedRef.current = true
      timeoutRef.current = setTimeout(() => {
        void navigate(getPathByKey('samplesAdd'))
      }, 1000)
    }

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [allDone, navigate])

  if (!id) return <AlertMessage type={AlertType.ERROR} message="Відсутній параметр id" />

  return (
    <div className="flex flex-wrap gap-x-2 gap-y-2">
      {dictTypedKeys(testsType).map((type) => (
        <div key={type} className="w-full">
          <TestsCreate id={id} type={type} onSuccess={onSuccess(type)} />

          <FormLayout as="div">
            {alerts[type] && (
              <AlertMessage type={alerts[type].type} message={alerts[type].message} />
            )}
          </FormLayout>
        </div>
      ))}
    </div>
  )
}
