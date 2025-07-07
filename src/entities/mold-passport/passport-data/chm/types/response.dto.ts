import type { PassportDataChmBase } from '@/entities/mold-passport/passport-data/chm/types/base.model'
import type { Timestamps } from '@/types/common'

export interface PassportDataChmResponse extends PassportDataChmBase {}

export interface PassportDataChmDetailResponse extends PassportDataChmResponse, Timestamps {}
