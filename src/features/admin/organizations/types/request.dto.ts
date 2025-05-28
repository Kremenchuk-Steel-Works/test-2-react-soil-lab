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
  registrationNumber: string | undefined
  taxId: string | undefined
  countryId: number
  contacts: ContactCreateRequest[]
  addresses: AddressCreateRequest[]
}

export interface OrganizationUpdateRequest {
  countryId?: number | undefined
  legalName?: string | undefined
  registrationNumber?: string | undefined
  taxId?: string | undefined
  contactOperations: ContactOperationRequest[]
  addressOperations: AddressOperationRequest[]
}
