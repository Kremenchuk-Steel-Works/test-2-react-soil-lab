import type { MoldingTechnologyBase } from '@/entities/mold-passport/molding-technologies/types/base.model'

export interface MoldingTechnologyCreateRequest extends MoldingTechnologyBase {}

export interface MoldingTechnologyUpdateRequest extends Partial<MoldingTechnologyBase> {}
