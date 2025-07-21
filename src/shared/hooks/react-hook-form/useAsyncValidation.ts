import { useCallback, useEffect, useState } from 'react'
import { useQueryClient, type QueryKey } from '@tanstack/react-query'
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'

interface UseDebouncedValidationProps<T extends FieldValues> {
  form: UseFormReturn<T>
  value: string
  fieldName: Path<T>
  validationFn: (value: string, signal: AbortSignal) => Promise<boolean>
  queryKeyFn: (fieldName: Path<T>, value: string) => QueryKey
  errorMessage: string
  debounceMs?: number
}

export function useDebouncedAsyncValidation<T extends FieldValues>({
  form,
  value,
  fieldName,
  validationFn,
  queryKeyFn,
  errorMessage,
  debounceMs = 1000,
}: UseDebouncedValidationProps<T>) {
  const { setError, clearErrors } = form
  const queryClient = useQueryClient()
  const [isChecking, setIsChecking] = useState(false)

  const runValidation = useCallback(
    async (currentValue: string): Promise<boolean> => {
      if (!currentValue) {
        clearErrors(fieldName)
        return true
      }

      const queryKey = queryKeyFn(fieldName, currentValue)
      const cachedData = queryClient.getQueryData<boolean>(queryKey)

      if (cachedData !== undefined) {
        if (cachedData === false) {
          setError(fieldName, { type: 'manual', message: errorMessage })
          return false
        } else {
          clearErrors(fieldName)
          return true
        }
      }

      setIsChecking(true)
      try {
        const isAvailable = await queryClient.fetchQuery({
          queryKey,
          queryFn: ({ signal }) => validationFn(currentValue, signal),
          staleTime: 5 * 60 * 1000,
        })

        if (isAvailable === false) {
          setError(fieldName, { type: 'manual', message: errorMessage })
          return false
        } else {
          clearErrors(fieldName)
          return true
        }
      } catch (error) {
        console.error(`Validation failed for ${fieldName}:`, error)
        return false // В случае ошибки сети считаем валидацию проваленной
      } finally {
        setIsChecking(false)
      }
    },
    [queryKeyFn, fieldName, queryClient, setError, clearErrors, errorMessage, validationFn],
  )

  // Эффект для live-валидации.
  useEffect(() => {
    const handler = setTimeout(() => {
      runValidation(value)
    }, debounceMs)
    return () => clearTimeout(handler)
  }, [value, debounceMs, runValidation])

  return { isChecking, triggerValidation: runValidation }
}
