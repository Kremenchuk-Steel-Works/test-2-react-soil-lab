import type { Timestamps } from "../../../../types/common"
import type { PaginatedListResponse } from "../../../../types/pagination"
import type { PersonShortResponse } from "../../people/types/response.dto"
import type { PermissionResponse } from "../../permissions/types/response.dto"
import type { RoleResponse } from "../../roles/types/response.dto"
import type { UserBase } from "./base.model"

export interface UserResponse extends UserBase {
  id: string
  person: PersonShortResponse
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
