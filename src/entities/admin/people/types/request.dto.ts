import type {
  AddressCreateRequest,
  AddressOperationRequest,
} from '@/entities/admin/address/types/request.dto'
import type {
  ContactCreateRequest,
  ContactOperationRequest,
} from '@/entities/admin/contact/types/request.dto'
import type {
  EmployeeProfileCreateRequest,
  EmployeeProfileUpdateRequest,
} from '@/entities/admin/employeeProfile/types/request.dto'
import type { PersonBase } from '@/entities/admin/people/types/base.model'

export interface PersonCreateRequest extends PersonBase {
  employeeProfile?: EmployeeProfileCreateRequest

  contacts?: ContactCreateRequest[]
  addresses?: AddressCreateRequest[]

  organizationIds?: string[]
  positionIds?: string[]
}

export interface PersonUpdateRequest extends Partial<PersonBase> {
  employeeProfileAction?: 'create' | 'update' | 'delete'
  employeeProfileData?: EmployeeProfileCreateRequest | EmployeeProfileUpdateRequest
  contactOperations?: ContactOperationRequest[]
  addressOperations?: AddressOperationRequest[]
  organizationIds?: string[]
  positionIds?: string[]
}
