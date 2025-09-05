import type {
  AddressCreateRequest,
  AddressOperationRequest,
} from '@/entities/admin-old/address/types/request.dto'
import type {
  ContactCreateRequest,
  ContactOperationRequest,
} from '@/entities/admin-old/contact/types/request.dto'
import type {
  EmployeeProfileCreateRequest,
  EmployeeProfileOperationRequest,
} from '@/entities/admin-old/employeeProfile/types/request.dto'
import type { PersonBase } from '@/entities/admin-old/people/types/base.model'

export interface PersonCreateRequest extends PersonBase {
  employeeProfile?: EmployeeProfileCreateRequest

  contacts?: ContactCreateRequest[]
  addresses?: AddressCreateRequest[]

  organizationIds?: string[]
  positionIds?: string[]
}

export interface PersonUpdateRequest extends Partial<PersonBase> {
  employeeProfileOperation?: EmployeeProfileOperationRequest
  contactOperations?: ContactOperationRequest[]
  addressOperations?: AddressOperationRequest[]
  organizationIds?: string[]
  positionIds?: string[]
}
