import type { MoldCoreBase } from '@/entities/mold-passport/mold-cores/types/base.model'
import type { Timestamps } from '@/types/common'

export interface MoldCoreResponse extends MoldCoreBase {
  id: string
}

export interface MoldCoreDetailResponse extends MoldCoreResponse, Timestamps {}
