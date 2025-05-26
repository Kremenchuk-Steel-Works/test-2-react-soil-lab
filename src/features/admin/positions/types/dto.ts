import type { Position } from "."
import type { PaginatedListResponse } from "../../../../types/pagination.types"

// Ответ от сервера
export type PositionsListResponse = PaginatedListResponse<"positions", Position>

// Запросы на создание и редактирование
