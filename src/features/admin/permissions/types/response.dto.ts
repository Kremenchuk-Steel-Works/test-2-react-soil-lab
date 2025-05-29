import type { Timestamps } from "../../../../types/common"
import type { PaginatedListResponse } from "../../../../types/pagination"
import type { DepartmentShortResponse } from "../../departments/types/response.dto"
import type { PermissionBase } from "./base.model"

export interface PermissionResponse extends PermissionBase {
  id: number
  department: DepartmentShortResponse
}

export interface PermissionDetailResponse
  extends PermissionResponse,
    Timestamps {}

export interface PermissionShortResponse extends PermissionBase {}

export interface PermissionListItemResponse {
  id: number
  name: string
  departmentName: string
}

export type PermissionListResponse =
  PaginatedListResponse<PermissionListItemResponse>
