import type { Permission } from "."
import type { PaginatedListResponse } from "../../../../types/pagination.types"

// Ответ от сервера
export type PermissionsListResponse = PaginatedListResponse<
  "permissions",
  Permission
>

// Запросы на создание и редактирование
