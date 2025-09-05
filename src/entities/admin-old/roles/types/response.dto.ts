import type {
  PermissionListItemResponse,
  PermissionLookupResponse,
} from '@/entities/admin-old/permissions/types/response.dto'
import type { RoleBase } from '@/entities/admin-old/roles/types/base.model'
import type { SoftArchiveStatusMixin, Timestamps } from '@/types/common'
import type { PaginatedListResponse } from '@/types/pagination'

export interface RoleLookupResponse {
  id: number
  name: string
}

export interface RoleShortResponse {
  id: number
  name: string
}
export interface RoleResponse extends RoleBase {
  id: number
}

export interface RoleDetailResponse extends RoleResponse, Timestamps, SoftArchiveStatusMixin {
  permissions: PermissionListItemResponse[]
}

export interface RoleListItemResponse extends RoleShortResponse, SoftArchiveStatusMixin {
  permissions: PermissionLookupResponse[]
}

export type RoleListResponse = PaginatedListResponse<RoleListItemResponse>
