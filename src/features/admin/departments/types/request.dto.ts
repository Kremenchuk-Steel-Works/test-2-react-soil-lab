export interface DepartmentCreateRequest {
  name: string
  description: string | undefined
}

export interface DepartmentUpdateRequest {
  name?: string | undefined
  description?: string | undefined
}
