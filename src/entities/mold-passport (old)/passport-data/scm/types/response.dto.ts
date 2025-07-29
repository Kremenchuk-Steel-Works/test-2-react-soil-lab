import type { PassportDataScmBase } from '@/entities/mold-passport (old)/passport-data/scm/types/base.model'
import type { Timestamps } from '@/types/common'

export interface PassportDataScmResponse extends PassportDataScmBase {}

export interface PassportDataScmDetailResponse extends PassportDataScmResponse, Timestamps {}
