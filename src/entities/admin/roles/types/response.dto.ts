import type { PermissionListItemResponse } from '@/entities/admin/permissions/types/response.dto'
import type { RoleBase } from '@/entities/admin/roles/types/base.model'
import type { Timestamps } from '@/types/common'
import type { PaginatedListResponse } from '@/types/pagination'

export interface RoleResponse extends RoleBase {
  id: number
}

export interface RoleLookupResponse {
  id: number
  name: string
}

export interface RoleDetailResponse extends RoleResponse, Timestamps {
  permissions: PermissionListItemResponse[]
}

export interface RoleShortResponse {
  id: number
  name: string
  permissions: PermissionListItemResponse[]
}

export type RoleListResponse = PaginatedListResponse<RoleShortResponse>
