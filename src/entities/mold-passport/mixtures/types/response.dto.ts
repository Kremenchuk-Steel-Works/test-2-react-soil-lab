import type { MixtureBase } from '@/entities/mold-passport/mixtures/types/base.model'
import type { Timestamps } from '@/types/common'

export interface MixtureResponse extends MixtureBase {
  id: string
  is_archived: boolean
  archived_at?: string
}

export interface MixtureDetailResponse extends MixtureResponse, Timestamps {}
