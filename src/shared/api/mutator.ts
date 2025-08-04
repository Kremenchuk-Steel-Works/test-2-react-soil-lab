import type { AxiosRequestConfig } from 'axios'
import { api } from '@/shared/api/client'

/**
 * Функция-мутатор, которую будет вызывать orval.
 * Она принимает конфиг запроса от orval и делегирует его
 * нашему кастомному экземпляру axios.
 * * Axios по умолчанию оборачивает ответ в { data: ... },
 * а react-query ожидает "голые" данные. Поэтому мы делаем .then(res => res.data).
 */
export const customMutator = <T>(config: AxiosRequestConfig): Promise<T> => {
  return api(config).then((response) => response.data)
}

export default customMutator
