import { useMemo } from 'react'
import { useQueries, type QueryKey, type UndefinedInitialDataOptions } from '@tanstack/react-query'

type QueryConfig<TQueryFnData = unknown, TError = Error> = Omit<
  UndefinedInitialDataOptions<TQueryFnData, TError>,
  'queryKey'
> & {
  queryKey: QueryKey
}

export type ParallelQueriesConfig = Record<string, QueryConfig<any, any>>

type QueryFnData<TQueryFn> = TQueryFn extends (...args: any) => infer TReturn
  ? Awaited<TReturn>
  : unknown

type ParallelQueriesData<T extends ParallelQueriesConfig> = {
  [K in keyof T]: QueryFnData<T[K]['queryFn']> | undefined
}

type ParallelQueriesReturn<T extends ParallelQueriesConfig> = {
  data: ParallelQueriesData<T>
  isLoading: boolean
  isError: boolean
  error: Error | null
}

/**
 * Выполняет несколько запросов React Query параллельно и возвращает результаты в виде объекта.
 * @param queries - Объект, где каждый ключ - это имя запроса, а значение - его конфигурация (queryKey и queryFn обязательны).
 * @returns Объект с полями: `data`, `isLoading`, `isError`, `error`.
 */
export function useParallelQueries<T extends ParallelQueriesConfig>(
  queries: T,
): ParallelQueriesReturn<T> {
  // Memoize to prevent re-running useQueries on every render if the queries object is defined inline
  const queryConfigs = useMemo(() => Object.values(queries), [queries])
  const queryKeys = useMemo(() => Object.keys(queries), [queries])

  const results = useQueries({
    queries: queryConfigs,
  })

  const isLoading = results.some((r) => r.isLoading)
  const isError = results.some((r) => r.isError)
  const error = (results.find((r) => r.error)?.error as Error) ?? null

  const data = useMemo(() => {
    const entries = queryKeys.map((key, index) => {
      const resultData = results[index]?.data
      return [key, resultData]
    })
    return Object.fromEntries(entries) as ParallelQueriesData<T>
  }, [queryKeys, results])

  return { data, isLoading, isError, error }
}
