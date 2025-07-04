import { useCallback } from 'react'

interface SelectOption<TValue = string | number> {
  value: TValue
  label: string
}

interface PaginatedResponse<T> {
  options: T[]
  hasMore: boolean
}

// Он должен иметь метод getPaginatedLookup.
interface PaginatedLookupService<T> {
  getPaginatedLookup: (search: string, page: number) => Promise<PaginatedResponse<T>>
}

// Тип для объекта, который говорит хуку, какие поля из объекта T использовать для value и label
interface OptionsMapper<T> {
  value: keyof T
  label: keyof T
}

/**
 * Кастомный хук для создания функции загрузки опций для асинхронных селектов.
 * @param service - Сервис, реализующий интерфейс PaginatedLookupService.
 * @param mapper - Объект, указывающий, какие поля использовать для value и label.
 * @returns Мемоизированная функция loadOptions.
 */
export function useAsyncOptionsLoader<T extends Record<string, any>>(
  service: PaginatedLookupService<T>,
  mapper: OptionsMapper<T>,
) {
  const loadOptions = useCallback(
    async (search: string, page: number) => {
      // Получаем данные с помощью переданного сервиса
      const { options, hasMore } = await service.getPaginatedLookup(search, page)

      // Трансформируем данные, используя ключи из mapper
      const formattedOptions: SelectOption[] = options.map((item) => ({
        value: item[mapper.value],
        label: String(item[mapper.label]), // Приводим label к строке на всякий случай
      }))

      return {
        options: formattedOptions,
        hasMore,
      }
    },
    [service, mapper], //Функция будет создана заново только если изменится сервис или маппер
  )

  return loadOptions
}
