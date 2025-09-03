import { useCallback } from 'react'
import { useQueryClient, type QueryKey, type UseQueryOptions } from '@tanstack/react-query'
import { logger } from '@/shared/lib/logger'

// A single option for a select component
export type SelectOption<TValue> = {
  value: TValue
  label: string
}

// The function that loads options asynchronously
export type AsyncOptionsLoader<TValue> = (
  search: string,
  page?: number,
) => Promise<{
  options: SelectOption<TValue>[]
  hasMore: boolean
}>

/** Стандартная структура ответа с пагинацией, которую ожидает хук */
interface PaginatedData<T> {
  items: T[]
  hasMore?: boolean
}

// --- Типы для конфигурации хука ---

type QueryOptionsProvider<TParams, TRawData> = (
  params: TParams,
) => UseQueryOptions<TRawData> & { queryKey: QueryKey }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ParamsBuilder = (search: string, page: number) => Record<string, any>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ResponseAdapter<TData> = (data: any) => PaginatedData<TData>

/**
 * Функция-маппер для преобразования одного элемента данных в формат SelectOption.
 * @param item - Один элемент из массива `items`.
 * @returns Объект с полями `value` и `label`.
 */
// ИЗМЕНЕНИЕ: Добавляем generic TValue для типа значения
type OptionsMapper<TData, TValue> = (item: TData) => { value: TValue; label: string }

/**
 * Объект конфигурации для хука useAsyncOptions.
 */
// ИЗМЕНЕНИЕ: Прокидываем TValue в конфиг
interface UseAsyncOptionsConfig<TData, TValue> {
  mapper: OptionsMapper<TData, TValue>
  paramsBuilder: ParamsBuilder
  responseAdapter: ResponseAdapter<TData>
}

/**
 * Кастомный хук для создания асинхронных, пагинируемых списков опций
 * для компонентов-селектов. Адаптирован для работы с сервисами,
 * сгенерированными через Orval.
 *
 * @param TData - Тип одного элемента в списке данных (например, `CastingTechnologyLookupResponse`).
 * @param TValue - Тип поля `value` у опции (например, `string` или `number`).
 * @param queryOptionsProvider - Функция-генератор опций от Orval.
 * @param config - Объект с конфигурацией мапперов и билдеров.
 */
// ИЗМЕНЕНИЕ: Добавляем второй generic TValue с ограничением
export function useAsyncOptions<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TData extends Record<string, any>,
  TValue extends string | number | boolean,
>(
  queryOptionsProvider: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  QueryOptionsProvider<any, any>,
  // ИЗМЕНЕНИЕ: Используем обновленный тип конфига
  config: UseAsyncOptionsConfig<TData, TValue>,
) {
  const { mapper, paramsBuilder, responseAdapter } = config
  const queryClient = useQueryClient()

  const loadOptions = useCallback(
    async (search: string, page: number = 1) => {
      const params = paramsBuilder(search, page)
      const { queryKey, queryFn } = queryOptionsProvider(params)

      if (!queryFn) {
        return { options: [], hasMore: false }
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const rawData = await queryClient.fetchQuery({ queryKey, queryFn })
        const data = responseAdapter(rawData)
        const formattedOptions = data.items.map(mapper)

        return {
          options: formattedOptions,
          hasMore: data.hasMore ?? false,
        }
      } catch (error) {
        logger.error('Failed to load async options:', error)
        return { options: [], hasMore: false }
      }
    },
    [queryClient, queryOptionsProvider, mapper, paramsBuilder, responseAdapter],
  )

  // Теперь loadOptions возвращает Promise<{ options: { value: TValue; label: string; }[], hasMore: boolean; }>
  // Этот тип полностью совместим с AsyncOptionsLoader из react-select
  return loadOptions
}
