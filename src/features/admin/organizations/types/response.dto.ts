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
import type { CountryShortResponse } from "../../country/types/response.dto"
import type { OrganizationBase } from "./base.model"

export interface OrganizationResponse extends OrganizationBase {
  id: string
  country: CountryShortResponse
  contacts: ContactResponse[]
  addresses: AddressResponse[]
}

export interface OrganizationDetailResponse
  extends Omit<OrganizationResponse, "contacts" | "addresses">,
    Timestamps {
  contacts: ContactDetailResponse[]
  addresses: AddressDetailResponse[]
}

export interface OrganizationShortResponse extends OrganizationBase {
  id: string
  countryName: string
}

export type OrganizationListResponse =
  PaginatedListResponse<OrganizationShortResponse>
