import { useCallback, useEffect, useRef, useState } from 'react'
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'

interface UseDebouncedAsyncValidationProps<T extends FieldValues> {
  form: UseFormReturn<T>
  value: string
  fieldName: Path<T>
  validationFn: (value: string, signal: AbortSignal) => Promise<boolean>
  errorMessage: string
  debounceMs?: number
}

export function useDebouncedAsyncValidation<T extends FieldValues>({
  form,
  value,
  fieldName,
  validationFn,
  errorMessage,
  debounceMs = 1000,
}: UseDebouncedAsyncValidationProps<T>) {
  const {
    setError,
    clearErrors,
    getFieldState,
    formState: { submitCount },
  } = form
  const [isChecking, setIsChecking] = useState(false)

  const validationCache = useRef<Record<string, boolean>>({})
  const abortControllerRef = useRef<AbortController | null>(null)

  const runValidation = useCallback(
    async (currentValue: string) => {
      const cachedResult = validationCache.current[currentValue]
      if (cachedResult !== undefined) {
        if (!cachedResult) {
          setError(fieldName, { type: 'manual', message: errorMessage })
        } else {
          if (getFieldState(fieldName).error?.message === errorMessage) {
            clearErrors(fieldName)
          }
        }
        return
      }

      abortControllerRef.current?.abort()
      const controller = new AbortController()
      abortControllerRef.current = controller

      setIsChecking(true)
      try {
        const isAvailable = await validationFn(currentValue, controller.signal)
        if (controller.signal.aborted) return

        validationCache.current[currentValue] = isAvailable
        if (!isAvailable) {
          setError(fieldName, { type: 'manual', message: errorMessage })
        } else {
          if (getFieldState(fieldName).error?.message === errorMessage) {
            clearErrors(fieldName)
          }
        }
      } catch (error) {
        if ((error as Error).name !== 'AbortError') console.error('Validation failed:', error)
      } finally {
        if (!controller.signal.aborted) setIsChecking(false)
      }
    },
    [validationFn, fieldName, errorMessage, setError, clearErrors, getFieldState],
  )

  useEffect(() => {
    if (!value) {
      clearErrors(fieldName)
      return
    }
    const handler = setTimeout(() => {
      runValidation(value)
    }, debounceMs)

    return () => {
      clearTimeout(handler)
      abortControllerRef.current?.abort()
    }
  }, [value, debounceMs, runValidation, clearErrors])

  useEffect(() => {
    if (submitCount > 0 && value) {
      runValidation(value)
    }
  }, [submitCount])

  return { isChecking }
}
