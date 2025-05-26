import type { Organization } from "."
import type { PaginatedListResponse } from "../../../../types/pagination.types"

// Ответ от сервера
export type OrganizationsListResponse = PaginatedListResponse<
  "organizations",
  Organization
>

// Запросы на создание и редактирование
export type CreateOrganizationDto = ""
