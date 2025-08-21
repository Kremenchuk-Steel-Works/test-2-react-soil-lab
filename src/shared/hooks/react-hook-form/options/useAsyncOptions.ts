import { useCallback } from 'react'
import { useQueryClient, type FetchQueryOptions } from '@tanstack/react-query'
import { logger } from '@/shared/lib/logger'

// Публичные типы
export type SelectOption<TValue> = { value: TValue; label: string }

export type AsyncOptionsLoader<TValue> = (
  search: string,
  page?: number,
) => Promise<{ options: SelectOption<TValue>[]; hasMore: boolean }>

// Внутренние типы
interface PaginatedData<TItem> {
  items: TItem[]
  hasMore?: boolean
}

// Утилиты для вывода типов
type InferParamsFromProvider<P> = P extends (params: infer PP, ...args: any[]) => any ? PP : never

// Логика вывода типов.
type InferDataFromProvider<P> = P extends (...args: any[]) => {
  queryFn?: infer Q
}
  ? Q extends (...args: any[]) => infer R
    ? Awaited<R>
    : never
  : never

/**
 * Хук для загрузки опций в асинхронных select-компонентах.
 */
export function useAsyncOptions<
  P extends (...args: any[]) => object,
  TItem,
  TValue extends string | number | boolean,
>(
  queryOptionsProvider: P,
  config: {
    paramsBuilder: (search: string, page: number) => InferParamsFromProvider<P>
    responseAdapter: (raw: InferDataFromProvider<P>) => PaginatedData<TItem>
    mapper: (item: TItem) => SelectOption<TValue>
    providerOptions?: Parameters<P>[1]
  },
): AsyncOptionsLoader<TValue> {
  const { paramsBuilder, responseAdapter, mapper, providerOptions } = config
  const queryClient = useQueryClient()

  const loadOptions = useCallback(
    async (search: string, page: number = 1) => {
      const params = paramsBuilder(search, page)
      const queryConfig = queryOptionsProvider(params, providerOptions)

      if (
        typeof queryConfig !== 'object' ||
        !queryConfig ||
        !('queryFn' in queryConfig) ||
        typeof queryConfig.queryFn !== 'function'
      ) {
        return { options: [], hasMore: false }
      }

      try {
        // Передаем весь объект
        const rawData = await queryClient.fetchQuery(
          queryConfig as FetchQueryOptions<InferDataFromProvider<P>>,
        )

        const { items, hasMore = false } = responseAdapter(rawData)
        const options = Array.isArray(items) ? items.map(mapper) : []

        return { options, hasMore }
      } catch (error) {
        logger.error('Failed to load async options:', error)
        return { options: [], hasMore: false }
      }
    },
    [queryClient, queryOptionsProvider, paramsBuilder, responseAdapter, mapper, providerOptions],
  )

  return loadOptions
}
