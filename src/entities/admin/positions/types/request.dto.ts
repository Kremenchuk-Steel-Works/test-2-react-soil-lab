import type { PositionBase } from '@/entities/admin/positions/types/base.model'

export interface PositionCreateRequest extends PositionBase {}

export interface PositionUpdateRequest extends Partial<PositionBase> {}
