import type { AxiosError } from "axios"
import { api } from "../api/client"
import type { User } from "../types/User"

export async function apiUsersMe() {
  try {
    const response = await api.get(`/users/me`)
    const user: User = response.data
    return user
  } catch (err) {
    const error = err as AxiosError
    if (error.response) {
      throw new Error(`Помилка сервера: ${error.response.status}`)
    } else if (error.request) {
      // Запрос был сделан, но ответ не получен (сервер упал)
      throw new Error("Сервер не відповідає. Спробуйте пізніше.")
    } else {
      // Что-то другое пошло не так
      throw new Error("Помилка запиту: " + error.message)
    }
  }
}
