import type { ShiftNumber } from '@/entities/mold-passport/mold-passport/types/shiftNumber'
import type { MoldPassportStatus } from '@/entities/mold-passport/mold-passport/types/status'
import type { PassportDataResponse } from '@/entities/mold-passport/passport-data/types/response.dto'

export interface MoldPassportBase {
  shiftNumber: ShiftNumber
  shiftMoldingNumber: number
  workshopTemperatureCelsius: number
  pressingPressure?: number
  markingYear: number
  moldAssemblyTimestamp: string
  status: MoldPassportStatus
  defectsDescription?: string

  experimentIds?: string[]
  passportData: PassportDataResponse
}
