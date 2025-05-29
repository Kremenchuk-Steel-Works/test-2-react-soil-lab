import type { EmployeeProfileBase } from "./base.model"

export interface EmployeeProfileCreateRequest extends EmployeeProfileBase {
  personId: string
}

export interface EmployeeProfileUpdateRequest
  extends Partial<EmployeeProfileBase> {}
