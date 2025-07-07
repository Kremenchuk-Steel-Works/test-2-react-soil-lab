import type { MoldCoresStatus } from '@/entities/mold-passport/mold-cores/types/status'

export interface MoldCoreBase {
  coreModelNumber: string
  manufacturingTimestamp: string
  hardness: number
  castingModelId: number
  status: MoldCoresStatus
}
