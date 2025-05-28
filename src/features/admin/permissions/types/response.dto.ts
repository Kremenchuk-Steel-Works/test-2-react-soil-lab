import type { PaginatedListResponse } from "../../../../types/pagination.types"
import type { DepartmentResponse } from "../../departments/types/response.dto"

export interface PermissionResponse {
  name: string
  description: string | undefined
  id: number
  department: DepartmentResponse
  createdAt: string
  updatedAt: string
}

export interface PermissionListItemResponse {
  id: number
  name: string
  departmentName: string
}

export type PermissionListResponse =
  PaginatedListResponse<PermissionListItemResponse>
