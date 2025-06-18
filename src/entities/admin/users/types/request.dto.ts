import type { UserBase } from "./base.model"

export interface UserCreateRequest extends UserBase {
  personId: string
  rawPassword: string

  rolesIds?: number[]
  permissionsIds?: number[]
}

export interface UserUpdateRequest extends Partial<UserBase> {
  rolesIds?: number[]
  permissionsIds?: number[]
}
