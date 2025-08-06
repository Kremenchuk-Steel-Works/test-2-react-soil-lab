import { useMemo } from 'react'
import type { Option } from '@/shared/ui/select/ReactSelect'

interface UseSelectOptionsConfig<T, V> {
  getValue: (item: T) => V
  getLabel: (item: T) => string
}

/**
 * Мемоизированный хук для преобразования массива данных в массив опций для селектов.
 * @param data - Массив данных, который нужно преобразовать. Может быть undefined во время загрузки.
 * @param config - Объект с функциями для извлечения value и label.
 * @returns Массив опций `Option<string>[]`.
 */
export function useSelectOptions<T, V extends string | number>(
  data: T[] | undefined,
  config: UseSelectOptionsConfig<T, V>,
): Option<V>[] {
  const { getValue, getLabel } = config

  return useMemo(() => {
    if (!Array.isArray(data)) {
      return []
    }
    return data.map((item) => ({
      value: getValue(item),
      label: getLabel(item),
    }))
  }, [data, getValue, getLabel])
}
