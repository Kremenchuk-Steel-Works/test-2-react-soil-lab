import type { DepartmentBase } from '@/entities/admin/departments/types/base.model'
import type { PermissionShortResponse } from '@/entities/admin/permissions/types/response.dto'
import type { SoftArchiveStatusMixin, Timestamps } from '@/types/common'
import type { PaginatedListResponse } from '@/types/pagination'

export interface DepartmentLookupResponse {
  id: string
  name: string
}

export interface DepartmentShortResponse extends DepartmentBase {
  id: string
}

export interface DepartmentResponse extends DepartmentBase {
  id: string
}

export interface DepartmentDetailResponse
  extends DepartmentResponse,
    Timestamps,
    SoftArchiveStatusMixin {
  permissions: PermissionShortResponse[]
}

export interface DepartmentListItemResponse extends DepartmentResponse, SoftArchiveStatusMixin {}

export type DepartmentListResponse = PaginatedListResponse<DepartmentListItemResponse>
