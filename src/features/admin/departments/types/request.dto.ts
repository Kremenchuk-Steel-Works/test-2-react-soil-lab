export interface DepartmentCreateRequest {
  name: string
  description: string | null
}

export interface DepartmentUpdateRequest {
  name?: string | null
  description?: string | null
}
