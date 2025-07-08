import type {
  MixtureChmBase,
  MixtureScmBase,
} from '@/entities/mold-passport/mixtures/types/base.model'

export interface MixtureScmCreateRequest extends MixtureScmBase {}
export interface MixtureChmCreateRequest extends MixtureChmBase {}

export interface MixtureScmUpdateRequest extends Partial<MixtureScmCreateRequest> {}
export interface MixtureChmUpdateRequest extends Partial<MixtureChmCreateRequest> {}

export type MixtureCreateRequest = MixtureScmCreateRequest | MixtureChmCreateRequest
export type MixtureUpdateRequest = Partial<MixtureCreateRequest>

export interface MixtureOperationRequest {
  action: 'create' | 'update' | 'delete'
  data?: MixtureCreateRequest | MixtureUpdateRequest
  id?: string
}
