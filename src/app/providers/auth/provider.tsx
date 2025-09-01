import { useEffect, useLayoutEffect, useState, type ReactNode } from 'react'
import {
  AxiosHeaders,
  isAxiosError,
  type AxiosRequestHeaders,
  type InternalAxiosRequestConfig,
} from 'axios'
import { AuthContext, type AuthContextType } from '@/app/providers/auth/context'
import { userService } from '@/entities/admin/users/services/service'
import type { UserDetailResponse } from '@/entities/admin/users/types/response.dto'
import type { LoginFormFields } from '@/entities/auth/forms/schema'
import { authService } from '@/entities/auth/services/service'
import { api } from '@/shared/api/client'
import { logger } from '@/shared/lib/logger'

// --- utils ---
const getStoredItem = (itemName: string): string | null =>
  localStorage.getItem(itemName) || sessionStorage.getItem(itemName) || null

const clearLocalStorageByKeyPrefix = (prefix: string) => {
  const keysToRemove: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(prefix)) keysToRemove.push(key)
  }
  keysToRemove.forEach((key) => {
    localStorage.removeItem(key)
    logger.debug(`Кэш формы очищен: ${key}`)
  })
}

// безопасная установка заголовков для Axios v1 без подмены типа headers
const setHeader = (cfg: InternalAxiosRequestConfig, key: string, value: string) => {
  if (!cfg.headers) {
    cfg.headers = {} as AxiosRequestHeaders
  }
  const h = cfg.headers
  if (h instanceof AxiosHeaders) {
    h.set(key, value)
  } else {
    ;(h as Record<string, string>)[key] = value
  }
}

// расширяем конфиг только нашими флагами (не трогаем тип headers)
type WithFlags = { _retry?: boolean; addAccessToken?: boolean }
type ReqCfg = InternalAxiosRequestConfig & WithFlags

// --- provider ---
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(() => getStoredItem('accessToken'))
  const [refreshToken, setRefreshToken] = useState<string | null>(() =>
    getStoredItem('refreshToken'),
  )
  // Присваивается изначально undefined, пока пользователь не будет проверен (null => не авторизован, undefined => проверяется)
  const [currentUser, setCurrentUser] = useState<UserDetailResponse | null>()

  // синхронный logout + совместимость по типу Promise<void>
  const performLogout = (): void => {
    logger.debug('Выполняем выход из системы')
    setAccessToken(null)
    setRefreshToken(null)
    setCurrentUser(null)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    sessionStorage.removeItem('accessToken')
    sessionStorage.removeItem('refreshToken')
    clearLocalStorageByKeyPrefix('formCache:')
  }
  const logout = (): Promise<void> => {
    performLogout()
    return Promise.resolve()
  }

  const login = async ({ email, password, rememberMe }: LoginFormFields) => {
    logger.debug('Выполняем вход в систему')
    const response = await authService.login({ email, password })
    await logout()

    setAccessToken(response.accessToken)
    setRefreshToken(response.refreshToken)

    const storage = rememberMe ? localStorage : sessionStorage
    storage.setItem('accessToken', response.accessToken)
    storage.setItem('refreshToken', response.refreshToken)
  }

  // Добавление токена
  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use((config) => {
      const cfg = config as ReqCfg

      logger.debug(`${cfg.method?.toUpperCase()} → ${cfg.url}`, {
        headersBefore: { ...cfg.headers },
      })

      if (!cfg._retry && cfg.addAccessToken !== false && accessToken) {
        setHeader(cfg, 'Authorization', `Bearer ${accessToken}`)
        logger.debug('Добавлен токен Authorization')

        // КОСТЫЛЬ
        if (currentUser?.id) {
          setHeader(cfg, 'X-User-Id', String(currentUser.id))
          logger.debug(`Добавлен X-User-Id → ${currentUser.id}`)
        }
      }

      return cfg
    })

    return () => {
      api.interceptors.request.eject(authInterceptor)
    }
  }, [accessToken, currentUser])

  // Обновление токена
  useLayoutEffect(() => {
    const refreshInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        // строгое сужение, без опасных приведения типов
        if (!isAxiosError<{ detail?: string }>(error)) {
          return Promise.reject(error instanceof Error ? error : new Error('Request failed'))
        }

        const originalRequest = error.config as ReqCfg | undefined
        const isTokenExpired =
          error.response?.status === 401 && error.response?.data?.detail === 'Token has expired.'

        if (isTokenExpired) {
          try {
            logger.debug('Обновляем токен', error.response?.data?.detail)

            if (!refreshToken || !originalRequest) {
              logger.warn('Отсутствует корректный refreshToken или originalRequest')
              return Promise.reject(error)
            }

            if (originalRequest._retry) {
              return Promise.reject(error)
            }

            const res = await authService.refresh({ refreshToken })
            logger.debug('Токен обновлен', res.accessToken)

            setAccessToken(res.accessToken)
            const storage =
              sessionStorage.getItem('accessToken') !== null ? sessionStorage : localStorage
            storage.setItem('accessToken', res.accessToken)

            setHeader(originalRequest, 'Authorization', `Bearer ${res.accessToken}`)
            originalRequest._retry = true

            return api(originalRequest)
          } catch (e) {
            setAccessToken(null)
            logger.debug('Токен не получилось обновить', e)
            return Promise.reject(e instanceof Error ? e : new Error('Token refresh failed'))
          }
        }

        return Promise.reject(error)
      },
    )

    return () => {
      api.interceptors.response.eject(refreshInterceptor)
    }
  }, [refreshToken])

  // Актуальные данные пользователя
  useEffect(() => {
    if (!accessToken) {
      logger.debug('accessToken не найден, пользователь не авторизован')
      setCurrentUser(null)
      return
    }

    logger.debug('Получаем актуальные данные пользователя')
    const fetchMe = async () => {
      try {
        const user = await userService.getMe()
        setCurrentUser(user)
        logger.debug(user)
      } catch (error) {
        setCurrentUser(null)
        throw error instanceof Error ? error : new Error('Failed to fetch user')
      }
    }

    void fetchMe()
  }, [accessToken])

  const value: AuthContextType = { accessToken, currentUser, login, logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
