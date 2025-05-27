import type { PaginatedListResponse } from "../../../../types/pagination.types"
import type { PersonResponse } from "../../people/types/response.dto"
import type { PermissionResponse } from "../../permissions/types/response.dto"
import type { RoleResponse } from "../../roles/types/response.dto"

export interface UserResponse {
  email: string
  id: string
  person: PersonResponse
  isActive: boolean
  isSuperuser: boolean
  lastLoginAt?: string | null
  roles: RoleResponse[]
  permissions: PermissionResponse[]
  createdAt: string
  updatedAt: string
}

export interface UserListItemResponse {
  email: string
  id: string
  fullName: string
  isActive: boolean
  isSuperuser: boolean
  lastLoginAt?: string | null
  roleNames: string[]
  permissionNames: string[]
}

export type UserListResponse = PaginatedListResponse<UserListItemResponse>
