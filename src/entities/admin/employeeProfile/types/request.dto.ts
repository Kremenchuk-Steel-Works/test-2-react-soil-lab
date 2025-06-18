import type { EmployeeProfileBase } from "./base.model"

export interface EmployeeProfileCreateRequest extends EmployeeProfileBase {}

export interface EmployeeProfileUpdateRequest
  extends Partial<EmployeeProfileBase> {}
