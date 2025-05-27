import type { PaginatedListResponse } from "../../../../types/pagination.types"
import type { AddressResponse } from "../../address/types/response.dto"
import type { ContactResponse } from "../../contact/types/response.dto"
import type { EmployeeProfileResponse } from "../../employeeProfile/types/response.dto"
import type { OrganizationResponse } from "../../organizations/types/response.dto"
import type { PositionResponse } from "../../positions/types/response.dto"
import type { Gender } from "./gender"

export interface PersonResponse {
  firstName: string
  middleName?: string | null
  lastName: string
  gender: Gender
  birthDate: string | null
  photoUrl: string | null
  id: string
  isUser: boolean
  employeeProfile?: EmployeeProfileResponse | null
  contacts?: ContactResponse[]
  addresses?: AddressResponse[]
  organizations?: OrganizationResponse[]
  positions?: PositionResponse[]
  createdAt: string
  updatedAt: string
}

export interface PersonListItemResponse {
  id: string
  fullName: string
  gender: Gender
  photoUrl: string
  isUser: boolean
  isEmployee: boolean
  organizationNames: string[]
  positionNames: string[]
}

export type PersonListResponse = PaginatedListResponse<PersonListItemResponse>
