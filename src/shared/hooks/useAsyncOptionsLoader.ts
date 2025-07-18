import { useCallback } from 'react'

interface SelectOption<TValue = string | number> {
  value: TValue
  label: string
}

interface PaginatedResponse<T> {
  options: T[]
  hasMore: boolean
}

/**
 * Тип для функции, которая будет запрашивать данные.
 */
export type OptionsFetcher<T> = (search: string, page: number) => Promise<PaginatedResponse<T>>

// Тип для объекта, который говорит хуку, какие поля из объекта T использовать для value и label
interface OptionsMapper<T> {
  value: keyof T
  label: keyof T
}

/**
 * Кастомный хук для создания функции загрузки опций для асинхронных селектов.
 * @param fetcher - Асинхронная функция для получения данных.
 * @param mapper - Объект, указывающий, какие поля использовать для value и label.
 * @returns Мемоизированная функция loadOptions.
 */
export function useAsyncOptionsLoader<
  TData extends Record<string, any>,
  TValue extends string | number,
>(fetcher: OptionsFetcher<TData>, mapper: OptionsMapper<TData>) {
  const loadOptions = useCallback(
    async (search: string, page: number) => {
      const { options, hasMore } = await fetcher(search, page)

      // Трансформируем данные, используя ключи из mapper
      const formattedOptions: SelectOption<TValue>[] = options.map((item) => ({
        value: item[mapper.value] as TValue,
        label: String(item[mapper.label]), // Приводим label к строке на всякий случай
      }))

      return {
        options: formattedOptions,
        hasMore,
      }
    },
    [fetcher, mapper], // Функция будет создана заново только если изменится fetcher или mapper
  )

  return loadOptions
}
