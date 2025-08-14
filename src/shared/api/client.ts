import axios, { AxiosError } from 'axios'
import axiosCaseConverter from 'axios-case-converter'
import { API_URL } from '@/shared/config/env'
import { logger } from '@/shared/lib/logger'

declare module 'axios' {
  export interface AxiosRequestConfig {
    meta?: {
      startTime: Date
    }
  }
}

// Создаем базовый инстанс
const baseApi = axios.create({
  baseURL: API_URL,
  timeout: 5_000,
})

// Сначала применяем конвертер регистров
export const api = axiosCaseConverter(baseApi)

// Request Interceptor
api.interceptors.request.use((config) => {
  // Добавляем метку времени для отслеживания длительности запроса
  config.meta = { startTime: new Date() }

  // Логируем ключевую информацию о запросе
  const { method, url, params, data } = config
  logger.info(`[API] -> Request`, {
    method: method?.toUpperCase(),
    url,
    params, // Query-параметры для GET запросов
    data, // Тело для POST/PUT/PATCH запросов
  })

  return config
})

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    // Успешный ответ
    const { config, status, data } = response
    const { method, url } = config
    const duration = config.meta ? new Date().getTime() - config.meta.startTime.getTime() : 0

    logger.info(`[API] <- Response`, {
      status,
      method: method?.toUpperCase(),
      url,
      duration: `${duration}ms`,
      data,
    })

    return response
  },
  (error: AxiosError) => {
    if (
      error.code === AxiosError.ERR_CANCELED ||
      axios.isCancel?.(error) ||
      error.name === 'CanceledError'
    ) {
      logger.info('[API] Request canceled', {
        method: error.config?.method?.toUpperCase(),
        url: error.config?.url,
      })
      // Пробрасываем дальше — React Query/внешний код не считает это ошибкой статуса.
      return Promise.reject(error)
    }

    // Ответ с ошибкой
    if (error.response) {
      const { config, status, data } = error.response
      const { method, url } = config
      const duration = config.meta ? new Date().getTime() - config.meta.startTime.getTime() : 0

      logger.error(`[API] <- Error Response`, {
        status,
        method: method?.toUpperCase(),
        url,
        duration: `${duration}ms`,
        errorData: data,
        originalRequest: {
          params: config.params,
          data: (() => {
            try {
              return typeof config.data === 'string' ? JSON.parse(config.data) : config.data
            } catch {
              return config.data
            }
          })(),
        },
      })
    } else if (error.request) {
      // Запрос был сделан, но ответ не был получен (например, таймаут или нет сети)
      logger.error('[API] Network Error or Timeout', {
        message: error.message,
        url: error.config?.url,
        code: error.code,
      })
    } else {
      // Ошибка на этапе настройки запроса
      logger.error('[API] Request Setup Error', {
        message: error.message,
      })
    }

    // Обязательно пробрасываем ошибку дальше, чтобы ее можно было поймать в коде (например, в .catch() или React Query)
    return Promise.reject(error)
  },
)
