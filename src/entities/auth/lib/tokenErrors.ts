import { AxiosError, isAxiosError } from 'axios'

type AuthErrorPayload = { detail?: string }

/**
 * Единая, простая проверка "access token expired".
 * Никакой магии — ровно та проверка, что ты просил.
 *
 * Возвращает type guard: если true, error — это AxiosError с payload AuthErrorPayload.
 */
export const accessTokenHasExpired = (error: unknown): error is AxiosError<AuthErrorPayload> => {
  if (!isAxiosError<AuthErrorPayload>(error)) return false
  const status = error.response?.status
  const detail = error.response?.data?.detail
  return status === 401 && detail === 'Access token has expired'
}
