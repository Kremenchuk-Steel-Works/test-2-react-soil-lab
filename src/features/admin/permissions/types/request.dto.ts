export interface PermissionCreateRequest {
  name: string
  description: string | undefined
  departmentId: string
}

export interface PermissionUpdateRequest {
  name?: string | undefined
  description?: string | undefined
  departmentId?: string | undefined
}
