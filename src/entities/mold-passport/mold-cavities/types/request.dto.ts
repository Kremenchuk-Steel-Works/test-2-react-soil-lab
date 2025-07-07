import type { MoldCavityBase } from '@/entities/mold-passport/mold-cavities/types/base.model'

export interface MoldCavityCreateRequest extends MoldCavityBase {}

export interface MoldCavityUpdateRequest extends Partial<MoldCavityCreateRequest> {}

export interface MoldCavityOperationRequest {
  action: 'create' | 'update' | 'delete'
  data?: MoldCavityCreateRequest | MoldCavityUpdateRequest
  id?: string
}
