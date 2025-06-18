import type { LoginRequest } from "../types/login/request.dto"
import type { TokenRefreshRequest } from "../types/token/request.dto"
import { api } from "../../../shared/api/client"
import type { TokenRefreshResponse } from "../types/token/response.dto"
import type { LoginResponse } from "../types/login/response.dto"
import { handleAxiosError } from "../../../shared/lib/axios"

export const authService = {
  async login({ email, password }: LoginRequest) {
    try {
      const response = await api.post<LoginResponse>(`/auth/login`, {
        email,
        password,
      })
      return response.data
    } catch (err) {
      handleAxiosError(err, (error) => {
        if (error.response?.status === 401) {
          return Error("Невірний email або пароль")
        }
        return false // Продолжить стандартную обработку
      })
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
      handleAxiosError(err)
    }
  },
}
