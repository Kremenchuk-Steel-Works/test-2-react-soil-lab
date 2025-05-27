import type {
  AddressCreateRequest,
  AddressOperationRequest,
} from "../../address/types/request.dto"
import type {
  ContactCreateRequest,
  ContactOperationRequest,
} from "../../contact/types/request.dto"

export interface OrganizationCreateRequest {
  legalName: string
  registrationNumber: string | null
  taxId: string | null
  countryId: number
  contacts: ContactCreateRequest[]
  addresses: AddressCreateRequest[]
}

export interface OrganizationUpdateRequest {
  countryId?: number | null
  legalName?: string | null
  registrationNumber?: string | null
  taxId?: string | null
  contactOperations: ContactOperationRequest[]
  addressOperations: AddressOperationRequest[]
}
