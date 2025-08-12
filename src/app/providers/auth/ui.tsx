import { useEffect, useLayoutEffect, useState } from 'react'
import { AuthContext, type AuthContextType } from '@/app/providers/auth/model'
import { userService } from '@/entities/admin/users/services/service'
import type { UserDetailResponse } from '@/entities/admin/users/types/response.dto'
import type { LoginFormFields } from '@/entities/auth/forms/schema'
import { authService } from '@/entities/auth/services/service'
import { api } from '@/shared/api/client'
import { logger } from '@/shared/lib/logger'

// Функции для чтения данных из storage:
const getStoredItem = (itemName: string): string | null => {
  return localStorage.getItem(itemName) || sessionStorage.getItem(itemName) || null
}

/**
 * Функция для очистки localStorage по префиксу.
 * Находит все ключи, начинающиеся с заданной строки, и удаляет их.
 * @param prefix Префикс ключей для удаления.
 */
const clearLocalStorageByKeyPrefix = (prefix: string) => {
  // Мы не можем итерироваться по localStorage напрямую,
  // поэтому сначала собираем все ключи в массив.
  const keysToRemove: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(prefix)) {
      keysToRemove.push(key)
    }
  }

  // Удаляем найденные ключи
  keysToRemove.forEach((key) => {
    localStorage.removeItem(key)
    logger.debug(`Кэш формы очищен: ${key}`)
  })
}

// Компонент-провайдер
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(() => getStoredItem('accessToken'))
  const [refreshToken, setRefreshToken] = useState<string | null>(() =>
    getStoredItem('refreshToken'),
  )
  const [currentUser, setCurrentUser] = useState<UserDetailResponse | null>()

  // Функция входа
  const login = async ({ email, password, rememberMe }: LoginFormFields) => {
    logger.debug('Выполняем вход в систему')
    const response = await authService.login({ email, password })

    // logout чтобы точно очистить все старые данные пользователя
    logout()
    logger.debug(response.accessToken)

    setAccessToken(response.accessToken)
    setRefreshToken(response.refreshToken)

    const storage = rememberMe ? localStorage : sessionStorage
    storage.setItem('accessToken', response.accessToken)
    storage.setItem('refreshToken', response.refreshToken)
  }

  // Функция выхода
  const logout = async () => {
    logger.debug('Выполняем выход из системы')
    setAccessToken(null)
    setRefreshToken(null)
    setCurrentUser(null)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    sessionStorage.removeItem('accessToken')
    sessionStorage.removeItem('refreshToken')

    // Очищаем весь кэш форм
    clearLocalStorageByKeyPrefix('formCache:')
  }

  // Перехватчик для добавления токена в header Authorization
  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use((config) => {
      const cfg = config as typeof config & { _retry?: boolean }

      // Логирование метода, URL и заголовков до изменения
      logger.debug(`${cfg.method?.toUpperCase()} → ${cfg.url}`, {
        headersBefore: { ...cfg.headers },
      })

      // Условное добавление токена в заголовки
      if (!cfg._retry && cfg.addAccessToken !== false && accessToken) {
        cfg.headers.Authorization = `Bearer ${accessToken}`
        logger.debug(`Добавлен токен → ${cfg.headers.Authorization}`)

        // КОСТЫЛЬ
        if (currentUser?.id) {
          config.headers['X-User-Id'] = currentUser.id
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
        const originalRequest = error.config

        logger.warn('Ошибка, проверяем нужно ли обновить токен', error.response.data.detail)
        if (
          !(error.response.status >= 200 && error.response.status < 300) &&
          error.response.data.detail === 'Token has expired.'
        ) {
          try {
            logger.debug('Обновляем токен', error.response.data.detail)

            if (!refreshToken) {
              logger.warn('Отсутствует корректный refreshToken')
              return Promise.reject(error)
            }
            const response = await authService.refresh({ refreshToken })

            logger.debug('Токен обновлен', response.accessToken)

            // Обновляем токены в состоянии
            setAccessToken(response.accessToken)
            const storage = sessionStorage.getItem('accessToken') ? sessionStorage : localStorage
            storage.setItem('accessToken', response.accessToken)

            // Повторяем запрос
            originalRequest.headers.Authorization = `Bearer ${response.accessToken}`
            originalRequest._retry = true
            return api(originalRequest)
          } catch (err) {
            setAccessToken(null)
            logger.debug('Токен не получилось обновить', err)
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
        throw error
      }
    }

    fetchMe()
  }, [accessToken])

  // Возвращаем провайдер с нужным значением
  const value: AuthContextType = { accessToken, currentUser, login, logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
