import { useCallback, useMemo, useState } from 'react'
import type { FieldValues, Path } from 'react-hook-form'
import { AsyncValidators } from '@/shared/ui/react-hook-form/async-validation/AsyncValidators'

// Тип конфига выносим для переиспользования
export type AsyncValidatorConfigSet<T extends FieldValues> = Parameters<
  typeof AsyncValidators<T>
>[0]['config']

interface UseAsyncValidatorsProps<T extends FieldValues> {
  config: AsyncValidatorConfigSet<T>
}

export function useAsyncValidators<T extends FieldValues>({ config }: UseAsyncValidatorsProps<T>) {
  // Внутреннее состояние, которое не зависит от formState.errors
  const [validationStates, setValidationStates] = useState<
    Record<string, { isChecking: boolean; hasError: boolean }>
  >({})

  const handleStatusChange = useCallback((name: Path<T>, isChecking: boolean) => {
    setValidationStates((prev) => ({
      ...prev,
      [name as string]: { ...prev[name as string], isChecking },
    }))
  }, [])

  const handleErrorChange = useCallback((name: Path<T>, hasError: boolean) => {
    setValidationStates((prev) => ({
      ...prev,
      [name as string]: { ...prev[name as string], hasError },
    }))
  }, [])

  // Вычисляем итоговые флаги
  const isAsyncValidating = useMemo(
    () => Object.values(validationStates).some((state) => state.isChecking),
    [validationStates],
  )

  const hasAsyncErrors = useMemo(
    () => Object.values(validationStates).some((state) => state.hasError),
    [validationStates],
  )

  const asyncCheckingFields = useMemo(
    () =>
      Object.entries(validationStates).reduce(
        (acc, [fieldName, state]) => {
          acc[fieldName as Path<T>] = !!state.isChecking
          return acc
        },
        {} as Record<Path<T>, boolean>,
      ),
    [validationStates],
  )

  // Создаем компонент для рендеринга "на лету"
  const AsyncValidatorsComponent = useCallback(
    () => (
      <AsyncValidators<T>
        config={config}
        onStatusChange={handleStatusChange}
        // Передаем onErrorChange в наш старый компонент-рендер
        onErrorChange={handleErrorChange}
      />
    ),
    [config, handleStatusChange, handleErrorChange],
  )

  return { isAsyncValidating, hasAsyncErrors, asyncCheckingFields, AsyncValidatorsComponent }
}
