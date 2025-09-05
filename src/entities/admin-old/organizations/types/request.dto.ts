import type {
  AddressCreateRequest,
  AddressOperationRequest,
} from '@/entities/admin-old/address/types/request.dto'
import type {
  ContactCreateRequest,
  ContactOperationRequest,
} from '@/entities/admin-old/contact/types/request.dto'
import type { OrganizationBase } from '@/entities/admin-old/organizations/types/base.model'

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
