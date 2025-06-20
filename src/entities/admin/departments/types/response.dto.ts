import type { Timestamps } from '@/types/common'
import type { PaginatedListResponse } from '@/types/pagination'
import type { PermissionShortResponse } from '@/entities/admin/permissions/types/response.dto'
import type { DepartmentBase } from '@/entities/admin/departments/types/base.model'

export interface DepartmentResponse extends DepartmentBase {
  id: string
}

export interface DepartmentLookupResponse {
  id: string
  name: string
}

export interface DepartmentDetailResponse
  extends DepartmentResponse,
    Timestamps {
  permissions: PermissionShortResponse[]
}

export interface DepartmentShortResponse extends DepartmentResponse {}

export type DepartmentListResponse =
  PaginatedListResponse<DepartmentShortResponse>
