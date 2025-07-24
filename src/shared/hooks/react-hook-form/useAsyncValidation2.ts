import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useQueryClient, type QueryKey } from '@tanstack/react-query'
import {
  get,
  type FieldErrors,
  type FieldValues,
  type Path,
  type UseFormReturn,
} from 'react-hook-form'
import { logger } from '@/shared/lib/logger'

type AsyncValidatorConfig<T extends FieldValues> = {
  validationFn: (value: string, signal: AbortSignal) => Promise<boolean>
  queryKeyFn: (fieldName: Path<T>, value: string) => QueryKey
  errorMessage: string
}

interface UseAsyncFormValidatorsProps<T extends FieldValues>
  extends Pick<
    UseFormReturn<T>,
    'setError' | 'clearErrors' | 'getValues' | 'watch' | 'getFieldState' | 'formState'
  > {
  config: Partial<Record<Path<T>, AsyncValidatorConfig<T>>>
  debounceMs?: number
}

interface UseAsyncFormValidatorsReturn {
  isChecking: Record<string, boolean>
  isAnyFieldChecking: boolean
  triggerAllValidations: () => Promise<boolean>
}

export const safeDeepCloneErrors = <T extends FieldValues>(
  errors: FieldErrors<T>,
): FieldErrors<T> => {
  try {
    return JSON.parse(
      JSON.stringify(errors, (key, value) => {
        if (key === 'ref') return undefined
        return value
      }),
    )
  } catch (e) {
    logger.error('Could not clone errors object', e)
    return {} as FieldErrors<T>
  }
}

export function useAsyncFormValidators2<T extends FieldValues>({
  setError,
  clearErrors,
  getValues,
  watch,
  getFieldState,
  formState,
  config,
  debounceMs = 1000,
}: UseAsyncFormValidatorsProps<T>): UseAsyncFormValidatorsReturn {
  logger.log('useAsyncFormValidators2')
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

      const { invalid: isInvalidField, error: errorField } = getFieldState(fieldName)

      // Если поле пустое, мы не запускаем асинхронную валидацию.
      // Вместо того чтобы слепо вызывать clearErrors, мы проверяем,
      // была ли ошибка установлена именно хуком
      if (!value || (isInvalidField && errorField?.type !== 'manual')) {
        if (errorField?.type === 'manual') {
          clearErrors(fieldName)
        }
        // Возвращаем true, т.к. сам асинхронный валидатор не нашел ошибок.
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
        // Если в кеше значение валидно, а ошибка висит, очищаем ее.
        if (errorField?.type === 'manual') {
          clearErrors(fieldName)
        }
        return true
      }

      setIsChecking((prev) => ({ ...prev, [fieldName as string]: true }))
      try {
        const isValid = await queryClient.fetchQuery({
          queryKey,
          queryFn: ({ signal }) => validationFn(value, signal),
          staleTime: 5 * 60 * 1000,
        })

        if (!isValid) {
          setError(fieldName, { type: 'manual', message: errorMessage })
          return false
        }

        // Очищаем ошибку только если она была установлена ранее
        if (errorField?.type === 'manual') {
          clearErrors(fieldName)
        }

        return true
      } catch (error) {
        logger.error(`Validation failed for ${fieldName}:`, error)
        // Устанавливаем ошибку в случае падения запроса
        setError(fieldName, { type: 'manual', message: 'Ошибка валидации' })
        return false
      } finally {
        setIsChecking((prev) => ({ ...prev, [fieldName as string]: false }))
      }
    },
    [queryClient, setError, clearErrors, getFieldState],
  )

  // Создаем ref для хранения последней версии runValidation
  const runValidationRef = useRef(runValidation)
  useEffect(() => {
    runValidationRef.current = runValidation
  })

  // Получаем список полей, за которыми нужно следить
  const fieldsToWatch = useMemo(() => Object.keys(config) as Path<T>[], [config])

  // Получаем их текущие значения
  const watchedValues = watch(fieldsToWatch)

  // Используем ref для хранения предыдущих значений, чтобы определить, какое поле изменилось
  const prevValuesRef = useRef(watchedValues)

  const prevErrorsRef = useRef(formState.errors)

  useEffect(() => {
    // Проверяем каждое поле
    fieldsToWatch.forEach((fieldName, index) => {
      const currentValue = watchedValues[index]
      const previousValue = prevValuesRef.current[index]

      logger.log(`values`, currentValue, previousValue)

      // Если значение поля изменилось, запускаем логику с debounce
      if (currentValue !== previousValue) {
        // logger.log(`Value for ${fieldName} changed from "${previousValue}" to "${currentValue}"`)

        // Очищаем старый таймер, если он был
        if (debounceTimers.current[fieldName]) {
          clearTimeout(debounceTimers.current[fieldName])
        }

        const fieldConfig = configRef.current[fieldName]
        if (!fieldConfig) return

        const { queryKeyFn } = fieldConfig
        const queryKey = queryKeyFn(fieldName, currentValue)

        const isValueCached = queryClient.getQueryData(queryKey) !== undefined
        const delay = isValueCached || !currentValue ? 1000 : debounceMs

        debounceTimers.current[fieldName] = setTimeout(() => {
          runValidation(fieldName, currentValue)
        }, delay)
      } else {
        const currentError = get(formState.errors, fieldName)
        const previousError = get(prevErrorsRef.current, fieldName)

        console.log('errors', previousError, currentError)

        // Запускаем повторную валидацию, только если была снята ошибка,
        // установленная именно этим хуком (type === 'manual'), а не допустим zod.
        if (previousError && previousError.type === 'manual' && !currentError) {
          // Запускаем валидацию немедленно, без debounce, чтобы восстановить состояние
          logger.log(`reuse`, currentError, previousError)
          runValidation(fieldName, currentValue)
        }
      }
    })

    // Обновляем ref последними значениями для следующего сравнения
    prevValuesRef.current = watchedValues
    prevErrorsRef.current = safeDeepCloneErrors(formState.errors)
  }, [watchedValues, fieldsToWatch, debounceMs, queryClient])

  // Функция очистки таймеров при размонтировании компонента
  useEffect(() => {
    return () => {
      Object.values(debounceTimers.current).forEach(clearTimeout)
    }
  }, [])

  const triggerAllValidations = useCallback(async (): Promise<boolean> => {
    const currentValues = getValues()
    const validationPromises: Promise<boolean>[] = []

    for (const fieldName in configRef.current) {
      if (Object.prototype.hasOwnProperty.call(configRef.current, fieldName)) {
        const value = currentValues[fieldName]
        validationPromises.push(runValidation(fieldName as Path<T>, value))
      }
    }

    const results = await Promise.all(validationPromises)
    return results.every((isValid) => isValid)
  }, [getValues, runValidation])

  return { isChecking, isAnyFieldChecking, triggerAllValidations }
}
