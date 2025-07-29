import type { MoldingAreasBase } from '@/entities/mold-passport (old)/molding-areas/types/base.model'

export interface MoldingAreasCreateRequest extends MoldingAreasBase {}

export interface MoldingAreasUpdateRequest extends Partial<MoldingAreasBase> {}
