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
  middleName?: string | null
  lastName: string
  gender: Gender
  birthDate: string | null
  photoUrl: string | null
  contacts: ContactCreateRequest[]
  addresses: AddressCreateRequest[]
  employeeProfile?: EmployeeProfileCreateRequest | null
  organizationIds: string[]
  positionIds: string[]
}

export interface PersonUpdateRequest {
  firstName?: string | null
  middleName?: string | null
  lastName?: string | null
  gender?: Gender | null
  birthDate?: string | null
  photoUrl?: string | null
  employeeProfileAction?: "create" | "update" | "delete" | null
  employeeProfileData?:
    | EmployeeProfileCreateRequest
    | EmployeeProfileUpdateRequest
    | null
  contactOperations: ContactOperationRequest[]
  addressOperations: AddressOperationRequest[]
  organizationIds?: string[] | null
  positionIds?: string[] | null
}
