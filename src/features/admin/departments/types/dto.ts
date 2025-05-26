import type { Department } from "."
import type { PaginatedListResponse } from "../../../../types/pagination.types"

// Ответ от сервера
export type DepartmentsListResponse = PaginatedListResponse<
  "departments",
  Department
>

// Запросы на создание и редактирование
