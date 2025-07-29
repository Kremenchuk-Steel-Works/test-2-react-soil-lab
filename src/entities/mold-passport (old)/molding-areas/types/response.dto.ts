import type { MoldingAreasBase } from '@/entities/mold-passport (old)/molding-areas/types/base.model'
import type { Timestamps } from '@/types/common'

export interface MoldingAreasResponse extends MoldingAreasBase {
  id: number
}

export interface MoldingAreasDetailResponse extends MoldingAreasResponse, Timestamps {}
