export interface ExperimentCreateRequest extends ExperimentBase {}

export interface ExperimentUpdateRequest extends Partial<ExperimentCreateRequest> {}

export interface ExperimentOperationRequest {
  action: 'create' | 'update' | 'delete'
  data?: ExperimentCreateRequest | ExperimentUpdateRequest
  id?: string
}
