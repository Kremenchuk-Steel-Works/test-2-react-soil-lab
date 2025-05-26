import type { Role } from "."
import type { PaginatedListResponse } from "../../../../types/pagination.types"

// Ответ от сервера
export type RolesListResponse = PaginatedListResponse<"roles", Role>

// Запросы на создание и редактирование
