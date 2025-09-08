import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { api } from '@/shared/api/client'

const normalizeUrl = (url?: string): string => {
  const raw = url ?? ''
  // убираем ведущие слэши, чтобы axios НЕ затирал path из baseURL
  let u = raw.replace(/^\/+/, '')
  // если orval дал 'api/v1/...', срезаем префикс — baseURL уже содержит '/api/v1'
  if (u.startsWith('api/v1/')) u = u.slice('api/v1/'.length)
  return u
}

/**
 * Функция-мутатор, которую будет вызывать orval.
 * Она принимает конфиг запроса от orval и делегирует его
 * нашему кастомному экземпляру axios.
 * * Axios по умолчанию оборачивает ответ в { data: ... },
 * а react-query ожидает "голые" данные. Поэтому мы делаем .then(res => res.data).
 */

export const customMutator = <T>(config: AxiosRequestConfig): Promise<T> => {
  const newConfig: AxiosRequestConfig = { ...config }
  newConfig.url = normalizeUrl(newConfig.url)

  // Передаем исправленный конфиг в инстанс axios
  return api<T, AxiosResponse<T>>(newConfig).then((res) => res.data)
}

export default customMutator
