import { useEffect, useLayoutEffect, useState } from "react"
import type { User } from "../../types/user"
import { api } from "../../api/client"
import type { AuthContextType } from "./AuthContext"
import AuthContext from "./AuthContext"
import { apiUsersMe } from "../../services/user"
import { logger } from "../../utils/logger"
import { authService } from "../../features/auth/services/service"
import type { LoginFormFields } from "../../features/auth/forms/schema"

// Функции для чтения данных из storage:
const getStoredItem = (itemName: string): string | null => {
  return (
    localStorage.getItem(itemName) || sessionStorage.getItem(itemName) || null
  )
}

// Компонент-провайдер
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    getStoredItem("accessToken")
  )
  const [refreshToken, setRefreshToken] = useState<string | null>(() =>
    getStoredItem("refreshToken")
  )
  const [currentUser, setCurrentUser] = useState<User | null>()

  // Функция входа
  const login = async ({ email, password, rememberMe }: LoginFormFields) => {
    logger.debug("Выполняем вход в систему")
    const response = await authService.login({ email, password })

    // logout чтобы точно очистить все старые данные пользователя
    logout()
    logger.debug(response.accessToken)

    setAccessToken(response.accessToken)
    setRefreshToken(response.refreshToken)

    const storage = rememberMe ? localStorage : sessionStorage
    storage.setItem("accessToken", response.accessToken)
    storage.setItem("refreshToken", response.refreshToken)
  }

  // Функция выхода
  const logout = async () => {
    logger.debug("Выполняем выход из системы")
    setAccessToken(null)
    setRefreshToken(null)
    setCurrentUser(null)
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    sessionStorage.removeItem("accessToken")
    sessionStorage.removeItem("refreshToken")
  }

  // Перехватчик для добавления токена в header Authorization
  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use((config) => {
      const cfg = config as typeof config & { _retry?: boolean }

      // ЛОГ: метод, URL, заголовки
      logger.debug(`${cfg.method?.toUpperCase()} → ${cfg.url}`, {
        headersBefore: { ...cfg.headers },
      })

      cfg.headers.Authorization =
        !cfg._retry && accessToken
          ? `Bearer ${accessToken}`
          : cfg.headers.Authorization
      logger.debug(`Добавлен токен → ${cfg.headers.Authorization}`)
      return cfg
    })

    return () => {
      api.interceptors.request.eject(authInterceptor)
    }
  }, [accessToken])

  // Обновление токена
  useLayoutEffect(() => {
    const refreshInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        logger.debug(
          "Ошибка, проверяем нужно ли обновить токен",
          error.response.data.detail
        )
        if (
          !(error.response.status >= 200 && error.response.status < 300) &&
          error.response.data.detail === "Token has expired."
        ) {
          try {
            logger.debug("Обновляем токен", error.response.data.detail)

            if (!refreshToken) {
              logger.warn("Отсутствует корректный refreshToken")
              return Promise.reject(error)
            }
            const response = await authService.refresh({ refreshToken })

            logger.debug("Токен обновлен", response.accessToken)

            // Обновляем токены в состоянии
            setAccessToken(response.accessToken)
            const storage = sessionStorage.getItem("accessToken")
              ? sessionStorage
              : localStorage
            storage.setItem("accessToken", response.accessToken)

            // Повторяем запрос
            originalRequest.headers.Authorization = `Bearer ${response.accessToken}`
            originalRequest._retry = true
            return api(originalRequest)
          } catch (err) {
            setAccessToken(null)
            logger.debug("Токен не получилось обновить", err)
          }
        }

        return Promise.reject(error)
      }
    )
    return () => {
      api.interceptors.response.eject(refreshInterceptor)
    }
  }, [refreshToken])

  // Актуальные данные пользователя
  useEffect(() => {
    if (!accessToken) {
      logger.debug("accessToken не найден, пользователь не авторизован")
      setCurrentUser(null)
      return
    }

    logger.debug("Получаем актуальные данные пользователя")
    const fetchMe = async () => {
      try {
        const user = await apiUsersMe()
        setCurrentUser(user)
        logger.debug(user)
      } catch (error) {
        setCurrentUser(null)
        throw error
      }
    }

    fetchMe()
  }, [accessToken])

  // Возвращаем провайдер с нужным значением
  const value: AuthContextType = { accessToken, currentUser, login, logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
