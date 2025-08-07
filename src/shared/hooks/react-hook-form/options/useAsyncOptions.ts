// src/hooks/useAsyncOptions.ts
import { useCallback } from 'react'
import { useQueryClient, type QueryKey, type UseQueryOptions } from '@tanstack/react-query'

// ... (интерфейсы SelectOption и PaginatedData остаются без изменений) ...
interface SelectOption<TValue = string | number> {
  value: TValue
  label: string
}
interface PaginatedData<T> {
  items: T[]
  hasMore?: boolean
}

type QueryOptionsProvider<TParams, TData> = (
  params: TParams,
) => UseQueryOptions<TData> & { queryKey: QueryKey }

interface OptionsMapper<T> {
  value: keyof T
  label: keyof T
}

// 👇 Функция-адаптер для преобразования ответа API
type ResponseAdapter<TRawData, TData> = (data: TRawData) => PaginatedData<TData>

export function useAsyncOptions<
  TData extends Record<string, any>,
  TParams extends Record<string, any>,
  TValue extends string | number,
  TRawData, // 👈 НОВЫЙ ТИП: "сырой" ответ от API
>(
  queryOptionsProvider: QueryOptionsProvider<TParams, TRawData>,
  mapper: OptionsMapper<TData>,
  paramsBuilder: (search: string, page: number) => TParams,
  responseAdapter: ResponseAdapter<TRawData, TData>, // 👈 НОВЫЙ АРГУМЕНТ: адаптер
) {
  const queryClient = useQueryClient()

  const loadOptions = useCallback(
    async (search: string, page: number = 1) => {
      const params = paramsBuilder(search, page)
      const { queryKey, queryFn } = queryOptionsProvider(params)

      // queryFn может быть undefined, добавим проверку
      if (!queryFn) {
        return { options: [], hasMore: false }
      }

      try {
        const rawData = await queryClient.fetchQuery<TRawData>({
          queryKey,
          queryFn,
        })

        // 👇 Используем адаптер для преобразования данных
        const data = responseAdapter(rawData)

        const formattedOptions: SelectOption<TValue>[] = data.items.map((item) => ({
          value: item[mapper.value] as TValue,
          label: String(item[mapper.label]),
        }))

        return {
          options: formattedOptions,
          hasMore: data.hasMore ?? false,
        }
      } catch (error) {
        console.error('Failed to load async options:', error)
        return { options: [], hasMore: false }
      }
    },
    [queryClient, queryOptionsProvider, mapper, paramsBuilder, responseAdapter],
  )

  return loadOptions
}
