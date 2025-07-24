import { useCallback, useEffect, useRef } from 'react'
import { useQueryClient, type QueryKey } from '@tanstack/react-query'
import { useController, useFormContext, type FieldValues, type Path } from 'react-hook-form'
import { logger } from '@/shared/lib/logger'

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
  const { setError, clearErrors, control, getFieldState } = useFormContext<T>()

  const {
    field: { value },
    fieldState: { error: currentError },
  } = useController({ name, control })

  const { validationFn, queryKeyFn, errorMessage } = config

  const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const prevErrorRef = useRef(currentError)
  const prevValueRef = useRef(value)

  /**
   * Защитный флаг для предотвращения немедленной валидации после очистки ошибки.
   * Когда пользователь начинает вводить текст в поле с ошибкой, мы немедленно
   * вызываем clearErrors(), что триггерит повторный запуск useEffect.
   * Этот флаг позволяет нам идентифицировать этот конкретный повторный запуск
   * и проигнорировать его, чтобы не нарушать логику debounce.
   */
  const isDebouncingRef = useRef(false)

  const runValidation = useCallback(
    async (valueToValidate: string) => {
      // Логика runValidation остается без изменений
      const setManualError = () => {
        if (getFieldState(name).error?.message === errorMessage) return
        setError(name, { type: 'manual', message: errorMessage })
        onErrorChange?.(name, true)
      }
      const clearManualError = () => {
        if (getFieldState(name).error?.type === 'manual') {
          clearErrors(name)
          onErrorChange?.(name, false)
        }
      }

      if (!valueToValidate) {
        clearManualError()
        return
      }

      const { error: zodError } = getFieldState(name)
      if (zodError && zodError.type !== 'manual') {
        return
      }

      const queryKey = queryKeyFn(name, valueToValidate)
      const cachedData = queryClient.getQueryData<boolean>(queryKey)

      if (cachedData !== undefined) {
        if (cachedData === false) setManualError()
        else clearManualError()
        return
      }

      onStatusChange?.(name, true)
      try {
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
    [name, queryClient, validationFn, queryKeyFn, errorMessage, onStatusChange],
  )

  useEffect(() => {
    // Всегда очищаем предыдущий таймер при каждом запуске эффекта
    clearTimeout(debounceTimerRef.current)

    const valueChanged = value !== prevValueRef.current

    if (valueChanged) {
      // Сценарий 1: Пользователь вводит новое значение.

      // Устанавливаем флаг, что мы начинаем процесс debounce.
      isDebouncingRef.current = true

      // Немедленно очищаем ошибку для лучшего UX.
      // Это вызовет повторный рендер и повторный запуск этого useEffect.
      if (getFieldState(name).error?.type === 'manual') {
        clearErrors(name)
        onErrorChange?.(name, false)
      }

      // Устанавливаем таймер для отложенной валидации.
      debounceTimerRef.current = setTimeout(() => {
        // Сбрасываем флаг перед запуском валидации.
        isDebouncingRef.current = false
        runValidation(value)
      }, debounceMs)
    } else if (isDebouncingRef.current) {
      // Сценарий 2: Эффект перезапустился из-за clearErrors(), вызванного выше.
      // `valueChanged` будет false. Флаг `isDebouncingRef` будет true.
      // Мы просто сбрасываем флаг и ничего не делаем.
      // Это предотвращает немедленный запуск валидации.
      isDebouncingRef.current = false
    } else {
      // Сценарий 3: Восстановление ошибки после того, как ее стерла другая валидация (например, Zod).
      // `valueChanged` = false, `isDebouncingRef` = false.
      const previousError = prevErrorRef.current
      if (previousError?.type === 'manual' && !currentError) {
        runValidation(value)
      }
    }

    // Обновляем ссылки в конце каждого цикла эффекта.
    prevErrorRef.current = currentError
    prevValueRef.current = value

    // Функция очистки для размонтирования компонента.
    return () => clearTimeout(debounceTimerRef.current)
  })

  return null
}
