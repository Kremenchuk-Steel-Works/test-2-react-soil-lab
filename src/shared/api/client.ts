import axios, { AxiosError, isAxiosError, type AxiosRequestConfig } from 'axios'
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
// export const api = axiosCaseConverter(baseApi)
export const api = baseApi

// Утилита безопасного получения логируемого значения
const toLoggable = (value: unknown): unknown => {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  }
  return value
}

// Проверяем, нужно ли нам логировать ошибку
const shouldSilenceExpired401 = (error: AxiosError): boolean => {
  const status = error.response?.status
  const detail = (error.response?.data as { detail?: string } | undefined)?.detail

  const cfg = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined
  // Первый 401 "Access token has expired" нам логировать не нужно — его перехватит refresh-интерцептор
  return status === 401 && detail === 'Access token has expired' && !cfg?._retry
}

// Request Interceptor
api.interceptors.request.use((config) => {
  // Добавляем метку времени для отслеживания длительности запроса
  config.meta = { startTime: new Date() }

  // Логируем ключевую информацию о запросе
  const { method, url } = config
  const params: unknown = config.params as unknown
  const requestData: unknown = toLoggable(config.data)

  logger.info(`[API] -> Request`, {
    method: method?.toUpperCase(),
    url,
    params,
    data: requestData,
  })

  return config
})

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    // Успешный ответ
    const { config, status } = response
    const { method, url } = config
    const duration = config.meta ? Date.now() - config.meta.startTime.getTime() : 0
    const responseData: unknown = toLoggable(response.data)

    logger.info(`[API] <- Response`, {
      status,
      method: method?.toUpperCase(),
      url,
      duration: `${duration}ms`,
      data: responseData,
    })

    return response
  },
  (error: AxiosError) => {
    // Тихо выходим для первого 401 "Access token has expired": пусть это обработает refresh-интерцептор.
    if (isAxiosError(error) && shouldSilenceExpired401(error)) {
      return Promise.reject(error)
    }

    if (
      error.code === AxiosError.ERR_CANCELED ||
      axios.isCancel?.(error) ||
      error.name === 'CanceledError'
    ) {
      logger.info('[API] Request canceled', {
        method: error.config?.method?.toUpperCase(),
        url: error.config?.url,
      })
      return Promise.reject(error)
    }

    // Ответ с ошибкой
    if (error.response) {
      const { config, status } = error.response
      const { method, url } = config
      const duration = config.meta ? Date.now() - config.meta.startTime.getTime() : 0

      const errorData: unknown = toLoggable(error.response.data)
      const originalParams: unknown = config.params as unknown
      const originalData: unknown = toLoggable(config.data)

      logger.error(`[API] <- Error Response`, {
        status,
        method: method?.toUpperCase(),
        url,
        duration: `${duration}ms`,
        errorData,
        originalRequest: {
          params: originalParams,
          data: originalData,
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

    // Обязательно пробрасываем ошибку дальше
    return Promise.reject(error)
  },
)
