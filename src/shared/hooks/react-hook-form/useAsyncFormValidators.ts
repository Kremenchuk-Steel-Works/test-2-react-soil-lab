import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useQueryClient, type QueryKey } from '@tanstack/react-query'
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'

type AsyncValidatorConfig<T extends FieldValues> = {
  validationFn: (value: string, signal: AbortSignal) => Promise<boolean>
  queryKeyFn: (fieldName: Path<T>, value: string) => QueryKey
  errorMessage: string
}

interface UseAsyncFormValidatorsProps<T extends FieldValues> {
  form: UseFormReturn<T>
  config: Partial<Record<Path<T>, AsyncValidatorConfig<T>>>
  debounceMs?: number
}

interface UseAsyncFormValidatorsReturn {
  isChecking: Record<string, boolean>
  isAnyFieldChecking: boolean
  triggerAllValidations: () => Promise<boolean>
}

export function useAsyncFormValidators<T extends FieldValues>({
  form,
  config,
  debounceMs = 1000,
}: UseAsyncFormValidatorsProps<T>): UseAsyncFormValidatorsReturn {
  const { setError, clearErrors, getValues, watch } = form
  const queryClient = useQueryClient()
  const [isChecking, setIsChecking] = useState<Record<string, boolean>>({})

  const isAnyFieldChecking = useMemo(() => {
    return Object.values(isChecking).some(Boolean)
  }, [isChecking])

  // Ref для хранения ID таймеров для каждого поля
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({})

  const configRef = useRef(config)
  configRef.current = config

  const runValidation = useCallback(
    async (fieldName: Path<T>, value: any): Promise<boolean> => {
      const fieldConfig = configRef.current[fieldName]
      if (!fieldConfig) return true

      if (!value) {
        clearErrors(fieldName)
        return true
      }

      const { queryKeyFn, validationFn, errorMessage } = fieldConfig
      const queryKey = queryKeyFn(fieldName, value)
      const cachedData = queryClient.getQueryData<boolean>(queryKey)

      if (cachedData !== undefined) {
        if (!cachedData) {
          setError(fieldName, { type: 'manual', message: errorMessage })
          return false
        }
        clearErrors(fieldName)
        return true
      }

      setIsChecking((prev) => ({ ...prev, [fieldName as string]: true }))
      try {
        const isAvailable = await queryClient.fetchQuery({
          queryKey,
          queryFn: ({ signal }) => validationFn(value, signal),
          staleTime: 5 * 60 * 1000,
        })

        if (!isAvailable) {
          setError(fieldName, { type: 'manual', message: errorMessage })
          return false
        }
        clearErrors(fieldName)
        return true
      } catch (error) {
        console.error(`Validation failed for ${fieldName}:`, error)
        setError(fieldName, { type: 'manual', message: 'Ошибка валидации' })
        return false
      } finally {
        setIsChecking((prev) => ({ ...prev, [fieldName as string]: false }))
      }
    },
    [queryClient, setError, clearErrors],
  )

  useEffect(() => {
    const subscription = watch((values, { name }) => {
      if (name && config[name as Path<T>]) {
        if (debounceTimers.current[name]) {
          clearTimeout(debounceTimers.current[name])
        }

        debounceTimers.current[name] = setTimeout(() => {
          runValidation(name as Path<T>, values[name])
        }, debounceMs)
      }
    })

    // Функция очистки при размонтировании компонента
    return () => {
      subscription.unsubscribe()
      // Очищаем все активные таймеры
      Object.values(debounceTimers.current).forEach(clearTimeout)
    }
  }, [watch, config, debounceMs, runValidation])

  const triggerAllValidations = useCallback(async (): Promise<boolean> => {
    const currentValues = getValues()
    const validationPromises: Promise<boolean>[] = []

    for (const fieldName in config) {
      if (Object.prototype.hasOwnProperty.call(config, fieldName)) {
        const value = currentValues[fieldName]
        validationPromises.push(runValidation(fieldName as Path<T>, value))
      }
    }

    const results = await Promise.all(validationPromises)
    return results.every((isValid) => isValid)
  }, [getValues, config, runValidation])

  return { isChecking, isAnyFieldChecking, triggerAllValidations }
}
