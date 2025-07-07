import type { MoldCoreBase } from '@/entities/mold-passport/mold-cores/types/base.model'

export interface MoldCoreCreateRequest extends MoldCoreBase {}

export interface MoldCoreUpdateRequest extends Partial<MoldCoreCreateRequest> {}
