import type { Timestamps } from "../../../../types/common"
import type { PaginatedListResponse } from "../../../../types/pagination"
import type {
  AddressDetailResponse,
  AddressResponse,
} from "../../address/types/response.dto"
import type {
  ContactDetailResponse,
  ContactResponse,
} from "../../contact/types/response.dto"
import type {
  EmployeeProfileDetailResponse,
  EmployeeProfileResponse,
} from "../../employeeProfile/types/response.dto"
import type { OrganizationShortResponse } from "../../organizations/types/response.dto"
import type { PositionShortResponse } from "../../positions/types/response.dto"
import type { PersonBase } from "./base.model"
import type { Gender } from "./gender"

export interface PersonShortResponse {
  id: string
  fullName: string
  gender: Gender
  photoUrl?: File
}

export interface PersonLookupResponse {
  id: string
  fullName: string
}

export interface PersonResponse extends PersonShortResponse {
  employeeProfile?: EmployeeProfileResponse
  contacts?: ContactResponse[]
  addresses?: AddressResponse[]

  organizationNames: string[]
  positionNames: string[]
}

export interface PersonDetailResponse extends PersonBase, Timestamps {
  id: string
  isUser: boolean

  employeeProfile?: EmployeeProfileDetailResponse
  contacts: ContactDetailResponse[]
  addresses: AddressDetailResponse[]

  organizations: OrganizationShortResponse[]
  positions: PositionShortResponse[]
}

export interface PersonListItemResponse extends PersonShortResponse {
  isUser: boolean
  isEmployee: boolean

  contactsCount: number
  addressesCount: number

  organizationNames: string[]
  positionNames: string[]
}

export type PersonListResponse = PaginatedListResponse<PersonListItemResponse>
