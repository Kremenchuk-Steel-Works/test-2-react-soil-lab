import type { ExperimentBase } from '@/entities/mold-passport (old)/experiments/types/base.model'

export interface ExperimentCreateRequest extends ExperimentBase {}

export interface ExperimentUpdateRequest extends Partial<ExperimentCreateRequest> {}

export interface ExperimentOperationRequest {
  action: 'create' | 'update' | 'delete'
  data?: ExperimentCreateRequest | ExperimentUpdateRequest
  id?: string
}
