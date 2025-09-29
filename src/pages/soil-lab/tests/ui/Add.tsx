import { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import TestsCreate from '@/features/soil-lab/tests/create/ui/TestsCreate'
import type { CreateTestApiV1TestsPostMutationResult } from '@/shared/api/soil-lab/endpoints/tests/tests'
import { TestStatus, TestType } from '@/shared/api/soil-lab/model'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import { FormLayout } from '@/shared/ui/react-hook-form/FormLayout'

type AlertState = { type: AlertType; message: string } | null
const TYPES: readonly TestType[] = Object.values(TestType) as TestType[]

function statusToAlert(res: CreateTestApiV1TestsPostMutationResult): AlertState {
  const status = res.status
  switch (status) {
    case TestStatus.passed:
      return {
        type: AlertType.SUCCESS,
        message: `Пройдено, результат: ${res.meanMeasurement}`,
      }
    case TestStatus.failed:
      return {
        type: AlertType.WARNING,
        message: `Провалено, результат: ${res.meanMeasurement}`,
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

  if (!id) return null

  return (
    <div className="flex flex-wrap gap-x-2 gap-y-2">
      {TYPES.map((type) => (
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
