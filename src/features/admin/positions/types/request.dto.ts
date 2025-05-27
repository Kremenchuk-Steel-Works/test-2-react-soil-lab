export interface PositionCreateRequest {
  name: string
  description: string
}

export interface PositionUpdateRequest {
  name?: string | null
  description?: string | null
}
