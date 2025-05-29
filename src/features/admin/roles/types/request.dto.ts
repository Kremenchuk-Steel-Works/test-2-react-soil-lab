import type { RoleBase } from "./base.model"

export interface RoleCreateRequest extends RoleBase {
  permissionIds?: number[]
}

export interface RoleUpdateRequest extends Partial<RoleCreateRequest> {}
