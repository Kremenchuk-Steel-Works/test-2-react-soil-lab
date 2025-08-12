import type { AxiosRequestConfig } from 'axios'
import { api } from '@/shared/api/client'

/**
 * Функция-мутатор, которую будет вызывать orval.
 * Она принимает конфиг запроса от orval и делегирует его
 * нашему кастомному экземпляру axios.
 * * Axios по умолчанию оборачивает ответ в { data: ... },
 * а react-query ожидает "голые" данные. Поэтому мы делаем .then(res => res.data).
 */

// export const customMutator = <T>(config: AxiosRequestConfig): Promise<T> => {
//   return api(config).then((response) => response.data)
// }

// export default customMutator

export const customMutator = <T>(config: AxiosRequestConfig): Promise<T> => {
  const newConfig = { ...config }

  // Если URL начинается с /api/v1, убираем этот префикс
  if (newConfig.url?.startsWith('/api/v1')) {
    newConfig.url = newConfig.url.replace('/api/v1', '')
  }

  // Берём базовый URL из нашего axios-инстанса и меняем порт на 8003
  const base = (api as any)?.defaults?.baseURL as string | undefined
  if (base) {
    try {
      const u = new URL(base)
      // меняем только порт
      u.port = '8003'
      // без завершающего слэша (чтобы не словить //)
      newConfig.baseURL = u.toString().replace(/\/$/, '')
    } catch {
      // если base невалидный (маловероятно), мягко откатываемся к строковой замене
      newConfig.baseURL = base.replace(':8001', ':8003')
    }
  } else {
    // на всякий случай: если вдруг base пустой — не ломаем запросы
    // (axios тогда возьмёт baseURL из инстанса как раньше)
  }

  // Передаем исправленный конфиг в инстанс axios
  return api(newConfig).then((response) => response.data)
}

export default customMutator
