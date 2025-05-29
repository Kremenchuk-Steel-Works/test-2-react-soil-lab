import type { PositionBase } from "./base.model"

export interface PositionCreateRequest extends PositionBase {}

export interface PositionUpdateRequest extends Partial<PositionBase> {}
