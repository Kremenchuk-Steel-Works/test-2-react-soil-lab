import type {
  AddressDetailResponse,
  AddressResponse,
} from '@/entities/admin-old/address/types/response.dto'
import type {
  ContactDetailResponse,
  ContactResponse,
} from '@/entities/admin-old/contact/types/response.dto'
import type {
  EmployeeProfileDetailResponse,
  EmployeeProfileResponse,
} from '@/entities/admin-old/employeeProfile/types/response.dto'
import type {
  OrganizationLookupResponse,
  OrganizationShortResponse,
} from '@/entities/admin-old/organizations/types/response.dto'
import type { PersonBase } from '@/entities/admin-old/people/types/base.model'
import type { Gender } from '@/entities/admin-old/people/types/gender'
import type {
  PositionLookupResponse,
  PositionShortResponse,
} from '@/entities/admin-old/positions/types/response.dto'
import type { SoftDeleteStatusMixin, Timestamps } from '@/types/common'
import type { PaginatedListResponse } from '@/types/pagination'

export interface PersonLookupResponse {
  id: string
  fullName: string
}

export interface PersonShortResponse {
  id: string
  fullName: string
  gender: Gender
  photoUrl?: File
}

export interface PersonResponse extends PersonBase {
  employeeProfile?: EmployeeProfileResponse

  contacts?: ContactResponse[]
  addresses?: AddressResponse[]

  organizations: OrganizationLookupResponse[]
  positions: PositionLookupResponse[]
}

export interface PersonDetailResponse extends PersonBase, Timestamps, SoftDeleteStatusMixin {
  id: string
  isUser: boolean

  employeeProfile?: EmployeeProfileDetailResponse

  contacts: ContactDetailResponse[]
  addresses: AddressDetailResponse[]

  organizations: OrganizationShortResponse[]
  positions: PositionShortResponse[]
}

export interface PersonListItemResponse extends PersonShortResponse, SoftDeleteStatusMixin {
  employeeProfile?: EmployeeProfileDetailResponse

  isEmployee: boolean
  isUser: boolean

  contactsCount: number
  addressesCount: number

  organizationNames: string[]
  positionNames: string[]
}

export type PersonListResponse = PaginatedListResponse<PersonListItemResponse>
