import type { PermissionResponse } from '@/entities/admin/permissions/types/response.dto'
import type { RoleResponse } from '@/entities/admin/roles/types/response.dto'
import type { UserBase } from '@/entities/admin/users/types/base.model'
import type { SoftDeleteStatusMixin, Timestamps } from '@/types/common'
import type { PaginatedListResponse } from '@/types/pagination'

export interface UserLookupResponse {
  id: string
  fullName: string
  email: string
}

export interface UserShortResponse extends UserBase {
  id: string
  fullName: string
}

export interface UserResponse extends UserBase {
  id: string
  fullName: string

  lastLoginAt?: string

  roles: RoleResponse[]
  permissions: PermissionResponse[]
}

export interface UserDetailResponse extends UserResponse, Timestamps, SoftDeleteStatusMixin {}

export interface UserListItemResponse extends UserShortResponse, SoftDeleteStatusMixin {
  lastLoginAt?: string

  roleNames: string[]
  permissionNames: string[]
}

export type UserListResponse = PaginatedListResponse<UserListItemResponse>
