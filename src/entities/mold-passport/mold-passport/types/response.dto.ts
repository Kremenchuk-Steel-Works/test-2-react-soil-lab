import type { ExperimentDetailResponse } from '@/entities/mold-passport/experiments/types/response.dto'
import type { MoldCavityDetailResponse } from '@/entities/mold-passport/mold-cavities/types/response.dto'
import type { MoldPassportBase } from '@/entities/mold-passport/mold-passport/types/base.model'
import type { MoldPassportStatus } from '@/entities/mold-passport/mold-passport/types/status'
import type { MoldingAreasDetailResponse } from '@/entities/mold-passport/molding-areas/types/response.dto'
import type { MoldingTechnologyDetailResponse } from '@/entities/mold-passport/molding-technologies/types/response.dto'
import type { PassportDataDetailResponse } from '@/entities/mold-passport/passport-data/types/response.dto'
import type { Timestamps } from '@/types/common'
import type { PaginatedListResponse } from '@/types/pagination'

export interface MoldPassportListItemResponse {
  id: string
  moldingAreaName: string
  moldingTechnologyName: string
  shiftNumber: number
  shiftMoldingNumber: number
  markingYear: number
  status: MoldPassportStatus
  cavitiesCount: number
}

export interface MoldPassportDetailResponse extends MoldPassportBase, Timestamps {
  id: string

  moldingArea: MoldingAreasDetailResponse
  moldingTechnology: MoldingTechnologyDetailResponse

  passportData: PassportDataDetailResponse

  cavities: MoldCavityDetailResponse[]
  experiments: ExperimentDetailResponse[]
}

export type MoldPassportListResponse = PaginatedListResponse<MoldPassportListItemResponse>
