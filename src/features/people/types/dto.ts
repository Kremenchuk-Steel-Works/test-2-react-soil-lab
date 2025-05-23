import type { Person } from "."
import type { PaginatedListResponse } from "../../../types/pagination.types"

// Ответ от сервера
export type PeopleListResponse = PaginatedListResponse<"people", Person>

// Запросы на создание и редактирование
export type CreateUserDto = ""
