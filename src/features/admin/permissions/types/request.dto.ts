import type { PermissionBase } from "./base.model"

export interface PermissionCreateRequest extends PermissionBase {
  departmentId: string
}

export interface PermissionUpdateRequest
  extends Partial<PermissionCreateRequest> {}
