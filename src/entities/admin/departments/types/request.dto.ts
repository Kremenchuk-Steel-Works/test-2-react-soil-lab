import type { DepartmentBase } from "./base.model"

export interface DepartmentCreateRequest extends DepartmentBase {}

export interface DepartmentUpdateRequest
  extends Partial<DepartmentCreateRequest> {}
