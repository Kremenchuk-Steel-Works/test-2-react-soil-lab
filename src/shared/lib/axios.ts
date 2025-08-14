import axios, { AxiosError } from 'axios'
import type { HttpValidationError } from '@/shared/api/mold-passport/model'

type ErrorHandler = (error: AxiosError) => Error | false

export function handleAxiosError(error: unknown, customHandler?: ErrorHandler): never {
  if (axios.isAxiosError(error)) {
    if (customHandler) {
      const result = customHandler(error)
      if (result instanceof Error) {
        throw result // Кастомная ошибка
      }
    }

    if (error.response) {
      const status = error.response.status
      switch (status) {
        case 400:
          throw new Error('Некоректні дані')
        case 401:
          throw new Error('Неавторизований доступ')
        case 404:
          throw new Error('Ресурс не знайдено')
        case 500:
          throw new Error('Помилка сервера. Спробуйте пізніше.')
        default:
          throw new Error(`Помилка сервера: ${status}`)
      }
    } else if (error.request) {
      throw new Error('Сервер не відповідає. Спробуйте пізніше.')
    } else {
      throw new Error(`Помилка запиту: ${error.message}`)
    }
  } else {
    throw new Error('Невідома помилка')
  }
}

// Тип-гард для HttpValidationError
function isHttpValidationError(data: unknown): data is HttpValidationError {
  return (
    typeof data === 'object' &&
    data !== null &&
    'detail' in data &&
    Array.isArray((data as HttpValidationError).detail)
  )
}

/**
 * Централизованно преобразует объект ошибки в человекочитаемое сообщение.
 * @param error - Ошибка, пойманная React Query (тип unknown)
 * @returns Строка с сообщением для пользователя
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data

    if (responseData && isHttpValidationError(responseData)) {
      return responseData.detail?.[0]?.msg || 'Помилка валідації даних.'
    }

    // Используем логику для стандартных HTTP-статусов
    const status = error.response?.status
    switch (status) {
      case 400:
        return 'Некоректні дані в запиті.'
      case 401:
        return 'Ви не авторизовані для виконання цієї дії.'
      case 403:
        return 'Доступ заборонено.'
      case 404:
        return 'Запитуваний ресурс не знайдено.'
      case 500:
      case 502:
      case 503:
        return 'Сервер тимчасово недоступний. Будь ласка, спробуйте пізніше.'
      default:
        if (status) {
          return `Сталася помилка з кодом: ${status}.`
        }
    }

    // Ошибки сети (сервер не ответил)
    if (error.request) {
      return "Не вдалося підключитися до сервера. Перевірте ваше інтернет-з'єднання."
    }
  }

  // Стандартные ошибки JavaScript
  if (error instanceof Error) {
    return error.message
  }

  // Запасной вариант
  return ''
}
