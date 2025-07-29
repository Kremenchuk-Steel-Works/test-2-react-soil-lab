import type {
  PassportDataChmDetailResponse,
  PassportDataChmResponse,
} from '@/entities/mold-passport (old)/passport-data/chm/types/response.dto'
import type {
  PassportDataScmDetailResponse,
  PassportDataScmResponse,
} from '@/entities/mold-passport (old)/passport-data/scm/types/response.dto'

export type PassportDataResponse = PassportDataScmResponse | PassportDataChmResponse

export type PassportDataDetailResponse =
  | PassportDataScmDetailResponse
  | PassportDataChmDetailResponse
