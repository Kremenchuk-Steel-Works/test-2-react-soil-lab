import type {
  AddressCreateRequest,
  AddressOperationRequest,
} from "../../address/types/request.dto"
import type {
  ContactCreateRequest,
  ContactOperationRequest,
} from "../../contact/types/request.dto"
import type {
  EmployeeProfileCreateRequest,
  EmployeeProfileUpdateRequest,
} from "../../employeeProfile/types/request.dto"
import type { PersonBase } from "./base.model"

export interface PersonCreateRequest extends PersonBase {
  employeeProfile?: EmployeeProfileCreateRequest

  contacts?: ContactCreateRequest[]
  addresses?: AddressCreateRequest[]

  organizationIds: string[]
  positionIds: string[]
}

export interface PersonUpdateRequest extends Partial<PersonBase> {
  employeeProfileAction?: "create" | "update" | "delete"
  employeeProfileData?:
    | EmployeeProfileCreateRequest
    | EmployeeProfileUpdateRequest
  contactOperations?: ContactOperationRequest[]
  addressOperations?: AddressOperationRequest[]
  organizationIds?: string[]
  positionIds?: string[]
}
