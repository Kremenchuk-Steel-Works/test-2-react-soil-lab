import { useEffect, useLayoutEffect, useState } from "react"
import { apiLogin } from "../../services/auth"
import type { FormLoginFields } from "../../pages/LoginPage"
import type { User } from "../../types/User"
import { api } from "../../api/client"
import type { AuthContextType } from "./AuthContext"
import AuthContext from "./AuthContext"
import log from "../../utils/logger"
import { apiUsersMe } from "../../services/user"

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
  const login = async ({ email, password, rememberMe }: FormLoginFields) => {
    log.debug("Выполняем вход в систему")
    const response = await apiLogin({ email, password })

    // logout чтобы точно очистить все старые данные пользователя
    logout()
    log.debug(response.access_token)

    setAccessToken(response.access_token)
    setRefreshToken(response.refresh_token)

    const storage = rememberMe ? localStorage : sessionStorage
    storage.setItem("accessToken", response.access_token)
    storage.setItem("refreshToken", response.refresh_token)
  }

  // Функция выхода
  const logout = async () => {
    log.debug("Выполняем выход из системы")
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
      log.debug(`[AuthInterceptor] ${cfg.method?.toUpperCase()} → ${cfg.url}`, {
        headersBefore: { ...cfg.headers },
      })

      cfg.headers.Authorization =
        !cfg._retry && accessToken
          ? `Bearer ${accessToken}`
          : cfg.headers.Authorization
      log.debug(
        `[AuthInterceptor] Добавлен токен → ${cfg.headers.Authorization}`
      )
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

        log.debug("Обновляем токен", error.response.data.detail)
        if (
          !(error.response.status >= 200 && error.response.status < 300) &&
          error.response.data.detail === "Token has expired."
        ) {
          try {
            const response = await api.post(
              `/auth/refresh`,
              { refresh_token: refreshToken },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            )
            log.debug("Токен обновлен", response.data.access_token)

            // Обновляем токены
            setAccessToken(response.data.access_token)
            const storage = sessionStorage.getItem("accessToken")
              ? sessionStorage
              : localStorage
            storage.setItem("accessToken", response.data.access_token)

            // Повторяем запрос
            originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`
            originalRequest._retry = true
            return api(originalRequest)
          } catch (err) {
            setAccessToken(null)
            log.debug("Токен не получилось обновить", err)
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
      log.debug("accessToken не найден, пользователь не авторизован")
      setCurrentUser(null)
      return
    }

    log.debug("Получаем актуальные данные пользователя")
    const fetchMe = async () => {
      try {
        const user = await apiUsersMe()
        setCurrentUser(user)
        log.debug(user)
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
