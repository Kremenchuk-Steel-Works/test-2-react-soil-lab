import axios, { AxiosError } from "axios"
import { API_URL } from "../config/env"

type LoginParams = {
  email: string
  password: string
}

export async function apiLogin({ email, password }: LoginParams) {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    })
    return response.data
  } catch (err) {
    const error = err as AxiosError
    if (error.response) {
      // Сервер ответил, но статус не 2xx
      if (error.response.status === 401) {
        throw new Error("Невірний email або пароль")
      } else if (error.response.status >= 400 && error.response.status < 500) {
        throw new Error("Некоректні дані")
      } else {
        throw new Error(`Помилка сервера: ${error.response.status}`)
      }
    } else if (error.request) {
      // Запрос был сделан, но ответ не получен (сервер упал)
      throw new Error("Сервер не відповідає. Спробуйте пізніше.")
    } else {
      // Что-то другое пошло не так
      throw new Error("Помилка запиту: " + error.message)
    }
  }
}
