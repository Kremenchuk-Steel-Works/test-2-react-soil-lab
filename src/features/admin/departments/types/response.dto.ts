import type { PaginatedListResponse } from "../../../../types/pagination.types"
import type { PermissionListItemResponse } from "../../permissions/types/response.dto"

export interface DepartmentResponse {
  name: string
  description: string | undefined
  id: string
  permissions: PermissionListItemResponse[]
  createdAt: string
  updatedAt: string
}

export interface DepartmentListItemResponse {
  name: string
  description: string | undefined
  id: string
}

export type DepartmentsListResponse =
  PaginatedListResponse<DepartmentListItemResponse>
