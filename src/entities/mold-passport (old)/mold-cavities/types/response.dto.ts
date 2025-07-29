import type { MoldCavityBase } from '@/entities/mold-passport (old)/mold-cavities/types/base.model'
import type { Timestamps } from '@/types/common'

export interface MoldCavityResponse extends MoldCavityBase {
  id: string
}

export interface MoldCavityDetailResponse extends MoldCavityResponse, Timestamps {}
