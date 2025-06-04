import { AxiosError } from "axios"
import type { LoginRequest } from "../types/login/request.dto"
import type { TokenRefreshRequest } from "../types/token/request.dto"
import { api } from "../../../api/client"
import type { TokenRefreshResponse } from "../types/token/response.dto"
import type { LoginResponse } from "../types/login/response.dto"

export const authService = {
  async login({ email, password }: LoginRequest) {
    try {
      const response = await api.post<LoginResponse>(`/auth/login`, {
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
        } else if (
          error.response.status >= 400 &&
          error.response.status < 500
        ) {
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
  },

  async refresh({ refreshToken }: TokenRefreshRequest) {
    try {
      const response = await api.post<TokenRefreshResponse>(
        `/auth/refresh`,
        { refreshToken: refreshToken },
        { addAccessToken: false }
      )
      return response.data
    } catch (err) {
      const error = err as AxiosError
      if (error.response) {
        // Сервер ответил, но статус не 2xx
        if (error.response.status >= 400 && error.response.status < 500) {
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
  },
}
