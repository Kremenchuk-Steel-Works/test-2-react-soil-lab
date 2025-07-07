import type {
  PassportDataChmCreateRequest,
  PassportDataChmUpdateRequest,
} from '@/entities/mold-passport/passport-data/chm/types/request.dto'
import type {
  PassportDataScmCreateRequest,
  PassportDataScmUpdateRequest,
} from '@/entities/mold-passport/passport-data/scm/types/request.dto'

export type PassportDataCreateRequest = PassportDataScmCreateRequest | PassportDataChmCreateRequest

export type PassportDataUpdateRequest = PassportDataScmUpdateRequest | PassportDataChmUpdateRequest
