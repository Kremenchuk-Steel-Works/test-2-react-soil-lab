import type { PaginatedListResponse } from "../../../../types/pagination.types"
import type { PermissionResponse } from "../../permissions/types/response.dto"

export interface RoleResponse {
  name: string
  description?: string | undefined
  id: number
  permissions: PermissionResponse[]
  createdAt: string
  updatedAt: string
}

export interface RoleListItemResponse {
  id: number
  name: string
}

export type RoleListResponse = PaginatedListResponse<RoleListItemResponse>
