import type { ReactNode } from 'react'
import type { FieldValues, SubmitHandler } from 'react-hook-form'
import { useFormCache, type UseFormCacheOptions } from '@/shared/hooks/react-hook-form/useFormCache'

export interface CacheConfig<T extends FieldValues> extends UseFormCacheOptions {
  /** Флаг, включающий или отключающий кэширование */
  enabled: boolean
  /** Уникальный ключ для кэша этой формы */
  cacheKey: string
  /** Массив ключей полей, которые нужно кэшировать */
  fieldsToCache: (keyof T)[]
}

interface CachedFormProps<T extends FieldValues> {
  // Конфигурация кэша для этой формы
  cacheConfig: CacheConfig<T>
  // Оригинальный обработчик отправки
  onSubmit: SubmitHandler<T>
  // Компонент формы, который мы оборачиваем
  children: (props: {
    // Данные по умолчанию, которые могут включать кэш
    defaultValues?: Partial<T>
    // Новый обработчик, который включает логику сохранения в кэш
    onSubmit: SubmitHandler<T>
  }) => ReactNode
  // Начальные данные, которые могут прийти не из кэша (частичные)
  initialData?: Partial<T>
}

export function CachedForm<T extends FieldValues>({
  cacheConfig,
  onSubmit,
  children,
  initialData,
}: CachedFormProps<T>) {
  // Если кэш выключен — подставляем «пустые» аргументы,
  // чтобы хук не трогал реальные данные.
  const isEnabled = cacheConfig.enabled
  const { cachedData, saveData } = useFormCache<T>(
    isEnabled ? cacheConfig.cacheKey : `__disabled__:${cacheConfig.cacheKey}`,
    isEnabled ? cacheConfig.fieldsToCache : [],
    isEnabled ? { ttl: cacheConfig.ttl } : undefined,
  )

  // Если кэширование выключено — возвращаем исходные пропсы без обёртки сохранения
  if (!isEnabled) {
    return children({
      defaultValues: initialData,
      onSubmit,
    })
  }

  const handleSubmitWithCache: SubmitHandler<T> = async (data, event) => {
    const result = await onSubmit(data, event)
    // Сохраняем данные в кэш только после успешной отправки
    saveData(data)
    return result
  }

  // Объединяем начальные данные и данные из кэша (кэш приоритетнее)
  const formDefaultValues = Object.assign({}, initialData, cachedData)

  return children({
    defaultValues: formDefaultValues,
    onSubmit: handleSubmitWithCache,
  })
}
