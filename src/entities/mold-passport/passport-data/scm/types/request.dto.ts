import type { PassportDataScmBase } from '@/entities/mold-passport/passport-data/scm/types/base.model'

export interface PassportDataScmCreateRequest extends PassportDataScmBase {}

export interface PassportDataScmUpdateRequest extends Partial<PassportDataScmBase> {}
