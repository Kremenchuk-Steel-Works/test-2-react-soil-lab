import { useMemo } from 'react'
import type { Option } from '@/shared/ui/select/ReactSelect'

// Дженерики:
// TData - тип объекта с данными, который мы передаем.
// TValue - тип `value` для опции.
export function useDefaultOption<TData, TValue extends string | number>(
  data: TData | null | undefined,
  // Принимаем одну функцию-маппер, как в useAsyncOptionsNew
  mapper: (data: TData) => Option<TValue>,
): Option<TValue>[] {
  return useMemo(() => {
    // Если данных нет, возвращаем пустой массив
    if (!data) {
      return []
    }

    // Если данные есть, просто вызываем маппер и оборачиваем результат в массив
    return [mapper(data)]
  }, [data, mapper])
}
