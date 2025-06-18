import type {
  AddressCreateRequest,
  AddressOperationRequest,
} from "../../address/types/request.dto"
import type {
  ContactCreateRequest,
  ContactOperationRequest,
} from "../../contact/types/request.dto"
import type { OrganizationBase } from "./base.model"

export interface OrganizationCreateRequest extends OrganizationBase {
  countryId: number
  contacts: ContactCreateRequest[]
  addresses: AddressCreateRequest[]
}

export interface OrganizationUpdateRequest extends Partial<OrganizationBase> {
  countryId?: number
  contactOperations?: ContactOperationRequest[]
  addressOperations?: AddressOperationRequest[]
}
