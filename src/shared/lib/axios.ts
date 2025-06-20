import axios, { AxiosError } from 'axios'

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
