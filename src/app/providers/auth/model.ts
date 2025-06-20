import { createContext, useContext } from 'react'
import type { UserDetailResponse } from '@/entities/admin/users/types/response.dto'

// Определяем тип контекста
export type AuthContextType = {
  accessToken: string | null | undefined
  currentUser: UserDetailResponse | null | undefined
  login: (args: { email: string; password: string; rememberMe: boolean }) => Promise<void>
  logout: () => Promise<void>
}

// Создаём контекст с типом и начальным значением undefined
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Хук для использования контекста
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
