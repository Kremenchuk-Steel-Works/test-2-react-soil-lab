import type { PermissionResponse } from '@/entities/admin/permissions/types/response.dto'
import type { RoleResponse } from '@/entities/admin/roles/types/response.dto'
import type { UserBase } from '@/entities/admin/users/types/base.model'
import type { Timestamps } from '@/types/common'
import type { PaginatedListResponse } from '@/types/pagination'

export interface UserResponse extends UserBase {
  id: string
  lastLoginAt?: string

  roles: RoleResponse[]
  permissions: PermissionResponse[]
}

export interface UserDetailResponse extends UserResponse, Timestamps {}

export interface UserShortResponse extends UserBase {
  id: string
  fullName: string
  lastLoginAt?: string

  roleNames: string[]
  permissionNames: string[]
}

export type UserListResponse = PaginatedListResponse<UserShortResponse>
