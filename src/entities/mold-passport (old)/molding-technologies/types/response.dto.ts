import type { MoldingTechnologyBase } from '@/entities/mold-passport (old)/molding-technologies/types/base.model'
import type { Timestamps } from '@/types/common'

export interface MoldingTechnologyResponse extends MoldingTechnologyBase {
  id: number
}

export interface MoldingTechnologyDetailResponse extends MoldingTechnologyResponse, Timestamps {}
