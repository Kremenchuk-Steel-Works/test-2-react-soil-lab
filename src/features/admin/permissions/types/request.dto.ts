export interface PermissionCreateRequest {
  name: string
  description: string | null
  departmentId: string
}

export interface PermissionUpdateRequest {
  name?: string | null
  description?: string | null
  departmentId?: string | null
}
