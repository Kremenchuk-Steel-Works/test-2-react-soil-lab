import type {
  AddressDetailResponse,
  AddressResponse,
} from '@/entities/admin/address/types/response.dto'
import type {
  ContactDetailResponse,
  ContactResponse,
} from '@/entities/admin/contact/types/response.dto'
import type { CountryShortResponse } from '@/entities/admin/country/types/response.dto'
import type { OrganizationBase } from '@/entities/admin/organizations/types/base.model'
import type { SoftArchiveStatusMixin, Timestamps } from '@/types/common'
import type { PaginatedListResponse } from '@/types/pagination'

export interface OrganizationLookupResponse {
  id: string
  legalName: string
  registrationNumber?: string
}

export interface OrganizationShortResponse extends OrganizationBase {
  id: string
}

export interface OrganizationResponse extends OrganizationBase {
  id: string
  country: CountryShortResponse
  contacts: ContactResponse[]
  addresses: AddressResponse[]
}

export interface OrganizationDetailResponse
  extends Omit<OrganizationResponse, 'contacts' | 'addresses'>,
    Timestamps,
    SoftArchiveStatusMixin {
  contacts: ContactDetailResponse[]
  addresses: AddressDetailResponse[]
}

export interface OrganizationListItemResponse
  extends OrganizationBase,
    Timestamps,
    SoftArchiveStatusMixin {
  countryName: string
}

export type OrganizationListResponse = PaginatedListResponse<OrganizationListItemResponse>
