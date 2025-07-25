import { useCallback, useEffect, useRef } from 'react'
import { useQueryClient, type QueryKey } from '@tanstack/react-query'
import { useController, useFormContext, type FieldValues, type Path } from 'react-hook-form'
import { createLogger } from '@/shared/lib/logger'

const logger = createLogger('AsyncValidator')

type AsyncValidatorConfig<T extends FieldValues> = {
  validationFn: (value: string, signal: AbortSignal) => Promise<boolean>
  queryKeyFn: (fieldName: Path<T>, value: string) => QueryKey
  errorMessage: string
}
type AsyncFieldValidatorProps<T extends FieldValues> = {
  name: Path<T>
  config: AsyncValidatorConfig<T>
  debounceMs?: number
  onStatusChange?: (name: Path<T>, isChecking: boolean) => void
  onErrorChange?: (name: Path<T>, hasError: boolean) => void
}

export function AsyncFieldValidator<T extends FieldValues>({
  name,
  config,
  debounceMs = 1000,
  onStatusChange,
  onErrorChange,
}: AsyncFieldValidatorProps<T>) {
  const queryClient = useQueryClient()
  const { setError, clearErrors, control, getFieldState, getValues } = useFormContext<T>()

  const {
    field: { value },
    fieldState: { error: currentError },
  } = useController({ name, control })

  const { validationFn, queryKeyFn, errorMessage } = config

  const prevErrorRef = useRef(currentError)
  const selfClearedErrorRef = useRef(false)

  // Валидация
  const runValidation = useCallback(
    async (valueToValidate: string) => {
      logger.debug(`[AsyncValidator: ${name}] runValidation called with: "${valueToValidate}"`)

      // setError
      const setManualError = () => {
        if (getFieldState(name).error?.message === errorMessage) return
        setError(name, { type: 'manual', message: errorMessage })
        onErrorChange?.(name, true)
      }

      // clearError
      const clearManualError = () => {
        if (getFieldState(name).error?.type === 'manual') {
          clearErrors(name)
          onErrorChange?.(name, false)
        }
      }

      // Обрабатываем состояния, изменяем onStatusChange
      try {
        // Если поле пустое, то не валидируем
        if (!valueToValidate) {
          clearManualError()
          return
        }

        // Если есть ошибка не поставленная этим хуком (напр. zod), то не валидируем
        const { error: zodError } = getFieldState(name)
        if (zodError && zodError.type !== 'manual') {
          logger.debug(`[AsyncValidator: ${name}] Skipped async validation due to Zod error.`)
          return
        }

        // Если есть данные в кеше, то не делаем запрос
        const queryKey = queryKeyFn(name, valueToValidate)
        const cachedData = queryClient.getQueryData<boolean>(queryKey)
        if (cachedData !== undefined) {
          if (cachedData === false) setManualError()
          else clearManualError()
          return
        }

        // Делаем запрос через react-query
        const isValid = await queryClient.fetchQuery({
          queryKey,
          queryFn: ({ signal }) => validationFn(valueToValidate, signal),
        })
        if (!isValid) setManualError()
        else clearManualError()
      } catch (e) {
        logger.error(`Validation request failed for ${name}:`, e)
        setError(name, { type: 'manual', message: 'Помилка сервера' })
      } finally {
        onStatusChange?.(name, false)
      }
    },
    [
      name,
      queryClient,
      validationFn,
      queryKeyFn,
      errorMessage,
      onStatusChange,
      onErrorChange,
      setError,
      clearErrors,
      getFieldState,
    ],
  )

  // Эффект #1: Запуск валидации после debounce
  useEffect(() => {
    logger.debug(`[AsyncValidator: ${name}] --- Debounce Effect Triggered ---`, { value })

    // Если нет значения, то не валидируем, убираем
    if (!value) {
      onStatusChange?.(name, false)
      return
    }

    onStatusChange?.(name, true)

    if (getFieldState(name).error?.type === 'manual') {
      logger.debug(`[AsyncValidator: ${name}] UX Improvement: Clearing manual error.`)
      selfClearedErrorRef.current = true
      clearErrors(name)
      onErrorChange?.(name, false)
    }

    const timer = setTimeout(() => {
      logger.debug(`[AsyncValidator: ${name}] --- Timer Fired ---`)
      runValidation(value)
    }, debounceMs)

    return () => {
      logger.debug(`[AsyncValidator: ${name}] Cleanup: Clearing timer for value "${value}"`)
      clearTimeout(timer)
    }
  }, [value, runValidation, debounceMs, getFieldState, clearErrors, onErrorChange, name])

  // Эффект #2: Восстановление ошибки
  useEffect(() => {
    logger.debug(`[AsyncValidator: ${name}] --- Error Restore Effect ---`, {
      prevError: prevErrorRef.current?.message,
      currentError: currentError?.message,
    })

    const wasManualError = prevErrorRef.current?.type === 'manual'
    const isNowCleared = !currentError

    if (wasManualError && isNowCleared) {
      if (selfClearedErrorRef.current) {
        logger.debug(`[AsyncValidator: ${name}] Error cleared by self. Ignoring restore.`)
      } else {
        logger.debug(`[AsyncValidator: ${name}] Manual error was cleared externally. Restoring...`)
        onStatusChange?.(name, true)
        // Используем getValues, чтобы получить самое свежее значение,
        const currentValue = getValues(name)
        runValidation(currentValue)
      }
    }

    selfClearedErrorRef.current = false
    prevErrorRef.current = currentError
  }, [currentError, runValidation, getValues, name])

  return null
}
