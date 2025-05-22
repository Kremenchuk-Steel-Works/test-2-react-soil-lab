import type { User } from "."

// Ответ от сервера
export type UsersListResponseDto = {
  users: User[]
  page: number
  total_pages: number
  total_items: number
}

// Запросы на создание и редактирование
export type CreateUserDto = ""
