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
import type { Gender } from "./gender"

export interface PersonCreateRequest {
  firstName: string
  middleName?: string | undefined
  lastName: string
  gender: Gender
  birthDate: string | undefined
  photoUrl: string | undefined
  contacts: ContactCreateRequest[]
  addresses: AddressCreateRequest[]
  employeeProfile?: EmployeeProfileCreateRequest | undefined
  organizationIds: string[]
  positionIds: string[]
}

export interface PersonUpdateRequest {
  firstName?: string | undefined
  middleName?: string | undefined
  lastName?: string | undefined
  gender?: Gender | undefined
  birthDate?: string | undefined
  photoUrl?: string | undefined
  employeeProfileAction?: "create" | "update" | "delete" | undefined
  employeeProfileData?:
    | EmployeeProfileCreateRequest
    | EmployeeProfileUpdateRequest
    | undefined
  contactOperations: ContactOperationRequest[]
  addressOperations: AddressOperationRequest[]
  organizationIds?: string[] | undefined
  positionIds?: string[] | undefined
}
