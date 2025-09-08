import { isAxiosError } from 'axios'

/** Сигнатура, которую отдает бэкенд */
export type ApiErrorPayload = {
  detail?: string
  message?: string
  errors?: Record<string, string> | Array<{ field: string; message: string }>
}

export type ParsedApiError = {
  status?: number
  message: string
  field?: string
}

export function parseApiError(err: unknown): ParsedApiError {
  if (isAxiosError<ApiErrorPayload>(err)) {
    const status = err.response?.status
    const data = err.response?.data
    const message =
      data?.detail ??
      data?.message ??
      // axios message как фолбэк, если сервер ничего не прислал
      err.message ??
      'Server error'

    // Пытаемся вытащить конкретное поле, если бэкенд прислал структурированные ошибки
    let field: string | undefined
    if (data?.errors && !Array.isArray(data.errors)) {
      // errors как объект
      const firstKey = Object.keys(data.errors)[0]
      field = firstKey
    } else if (Array.isArray(data?.errors)) {
      field = data.errors[0]?.field
    }

    return { status, message, field }
  }

  return {
    message: err instanceof Error ? err.message : 'Unknown error',
  }
}
