import type { PassportDataChmBase } from '@/entities/mold-passport (old)/passport-data/chm/types/base.model'

export interface PassportDataChmCreateRequest extends PassportDataChmBase {}

export interface PassportDataChmUpdateRequest extends Partial<PassportDataChmBase> {}
