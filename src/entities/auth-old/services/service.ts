import type { LoginRequest } from '@/entities/auth-old/types/login/request.dto'
import type { LoginResponse } from '@/entities/auth-old/types/login/response.dto'
import type { TokenRefreshRequest } from '@/entities/auth-old/types/token/request.dto'
import type { TokenRefreshResponse } from '@/entities/auth-old/types/token/response.dto'
import { api } from '@/shared/api/client'
import { handleAxiosError } from '@/shared/lib/axios'

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
          return Error('Невірний email або пароль')
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
        { addAccessToken: false },
      )
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },
}
