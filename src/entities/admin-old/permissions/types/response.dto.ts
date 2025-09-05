import type { DepartmentShortResponse } from '@/entities/admin-old/departments/types/response.dto'
import type { PermissionBase } from '@/entities/admin-old/permissions/types/base.model'
import type { Timestamps } from '@/types/common'
import type { PaginatedListResponse } from '@/types/pagination'

export interface PermissionLookupResponse {
  id: number
  name: string
  departmentName: string
}

export interface PermissionShortResponse extends PermissionBase {
  id: number
  departmentId: string
}

export interface PermissionResponse extends PermissionBase {
  id: number
  department: DepartmentShortResponse
}

export interface PermissionDetailResponse extends PermissionResponse, Timestamps {}

export interface PermissionListItemResponse extends PermissionBase {
  id: number
  departmentName: string
}

export type PermissionListResponse = PaginatedListResponse<PermissionListItemResponse>
