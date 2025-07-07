import type { Timestamps } from '@/types/common'

export interface ExperimentResponse extends ExperimentBase {
  id: string
}

export interface ExperimentDetailResponse extends ExperimentResponse, Timestamps {}
