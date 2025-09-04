import { useCallback } from 'react'
import { useQueryClient, type UseQueryOptions } from '@tanstack/react-query'
import { logger } from '@/shared/lib/logger'

export type SelectOption<TValue> = { value: TValue; label: string }

export type AsyncOptionsLoader<TValue> = (
  search: string,
  page?: number,
) => Promise<{ options: SelectOption<TValue>[]; hasMore: boolean }>

interface PaginatedData<TItem> {
  items: TItem[]
  hasMore?: boolean
}

/**
 * Хук для загрузки опций в асинхронных select-компонентах.
 * Он использует fetchQuery из @tanstack/react-query для эффективного кэширования.
 *
 * @template TParams - Тип объекта параметров для запроса.
 * @template TQueryFnData - Тип "сырых" данных, которые возвращает queryFn API (orval).
 * @template TItem - Тип одного элемента в списке данных.
 * @template TValue - Тип значения для `SelectOption`.
 * @template TError - Тип ошибки запроса.
 */
export function useAsyncOptions<
  TParams extends object,
  TQueryFnData,
  TItem,
  TValue extends string | number | boolean,
  TError = Error,
>(
  queryOptionsProvider: (params: TParams) => UseQueryOptions<TQueryFnData, TError>,
  config: {
    paramsBuilder: (search: string, page: number) => TParams
    responseAdapter: (data: TQueryFnData) => PaginatedData<TItem>
    mapper: (item: TItem) => SelectOption<TValue>
  },
): AsyncOptionsLoader<TValue> {
  const { paramsBuilder, responseAdapter, mapper } = config
  const queryClient = useQueryClient()

  const loadOptions = useCallback(
    async (search: string, page: number = 1) => {
      const params = paramsBuilder(search, page)
      // Получаем конфигурацию запроса от orval-генератора
      const { queryKey, queryFn } = queryOptionsProvider(params)

      if (!queryFn) {
        logger.error('Query function is not defined for async options.')
        return { options: [], hasMore: false }
      }

      try {
        const rawData = await queryClient.fetchQuery<TQueryFnData, TError>({
          queryKey,
          queryFn,
        })

        const { items, hasMore = false } = responseAdapter(rawData)
        const options = Array.isArray(items) ? items.map(mapper) : []

        return { options, hasMore }
      } catch (error) {
        logger.error('Failed to load async options:', error)
        return { options: [], hasMore: false }
      }
    },
    [queryClient, queryOptionsProvider, paramsBuilder, responseAdapter, mapper],
  )

  return loadOptions
}
