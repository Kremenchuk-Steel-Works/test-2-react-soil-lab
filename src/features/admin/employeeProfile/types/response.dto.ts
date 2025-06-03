import type { Timestamps } from "../../../../types/common"
import type { EmployeeProfileBase } from "./base.model"

export interface EmployeeProfileResponse extends EmployeeProfileBase {}

export interface EmployeeProfileDetailResponse
  extends EmployeeProfileResponse,
    Timestamps {}
