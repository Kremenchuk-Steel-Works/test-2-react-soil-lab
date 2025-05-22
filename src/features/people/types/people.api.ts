import type { Person } from "."

// Ответ от сервера
export type PeopleListResponseDto = {
  people: Person[]
  page: number
  total_pages: number
  total_items: number
}

// Запросы на создание и редактирование
export type CreateUserDto = ""
