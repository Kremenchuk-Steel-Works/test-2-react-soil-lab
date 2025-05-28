export interface PositionCreateRequest {
  name: string
  description: string
}

export interface PositionUpdateRequest {
  name?: string | undefined
  description?: string | undefined
}
