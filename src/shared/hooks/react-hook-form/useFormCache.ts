import { useCallback, useMemo } from 'react'
import { type FieldValues } from 'react-hook-form'

interface CachedFormData<T> {
  data: Partial<T>
  expiry: number
}

// TTL по умолчанию: 1 час
const DEFAULT_TTL_MS = 1 * 60 * 60 * 1000

export interface UseFormCacheOptions {
  /** Время жизни кэша в миллисекундах */
  ttl?: number
}

/**
 * Хук для управления кэшем данных формы в localStorage.
 * @param key Уникальный ключ для кэша этой формы.
 * @param fieldsToCache Массив ключей полей, которые нужно кэшировать.
 * @param options Необязательные настройки, например, время жизни кэша.
 */
export function useFormCache<T extends FieldValues>(
  key: string,
  fieldsToCache: (keyof T)[],
  options?: UseFormCacheOptions,
) {
  const cachedData = useMemo((): Partial<T> | null => {
    const item = localStorage.getItem(key)
    if (!item) {
      return null
    }

    try {
      const parsed = JSON.parse(item) as CachedFormData<T>
      const isExpired = new Date().getTime() > parsed.expiry

      if (isExpired) {
        localStorage.removeItem(key)
        return null
      }
      return parsed.data
    } catch (error) {
      console.error('Failed to parse form cache:', error)
      localStorage.removeItem(key)
      return null
    }
  }, [key])

  const saveData = useCallback(
    (formData: T) => {
      // TTL из опций или значение по умолчанию
      const ttl = options?.ttl ?? DEFAULT_TTL_MS

      const dataToStore = fieldsToCache.reduce((acc, fieldKey) => {
        if (formData[fieldKey] !== undefined) {
          acc[fieldKey] = formData[fieldKey]
        }
        return acc
      }, {} as Partial<T>)

      const item: CachedFormData<T> = {
        data: dataToStore,
        expiry: new Date().getTime() + ttl, // Динамическое время жизни
      }

      localStorage.setItem(key, JSON.stringify(item))
    },
    [key, fieldsToCache, options],
  )

  const clearCache = useCallback(() => {
    localStorage.removeItem(key)
  }, [key])

  return { cachedData, saveData, clearCache }
}
