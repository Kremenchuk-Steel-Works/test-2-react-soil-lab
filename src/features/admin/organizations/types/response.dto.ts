import type { PaginatedListResponse } from "../../../../types/pagination.types"
import type { AddressResponse } from "../../address/types/response.dto"
import type { ContactResponse } from "../../contact/types/response.dto"
import type { CountryResponse } from "../../country/types/response.dto"

export interface OrganizationResponse {
  legalName: string
  registrationNumber: string | undefined
  taxId: string | undefined
  id: string
  country: CountryResponse
  contacts: ContactResponse[]
  addresses: AddressResponse[]
  createdAt: string
  updatedAt: string
}

export interface OrganizationListItemResponse {
  legalName: string
  registrationNumber: string | undefined
  taxId: string | undefined
  id: string
  countryName: string
}

export type OrganizationListResponse =
  PaginatedListResponse<OrganizationListItemResponse>
