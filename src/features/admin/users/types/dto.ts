import type { User } from "."
import type { PaginatedListResponse } from "../../../../types/pagination.types"

// Ответ от сервера
export type UsersListResponse = PaginatedListResponse<"users", User>

// Запросы на создание и редактирование
