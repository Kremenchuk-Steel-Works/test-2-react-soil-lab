export interface RoleCreateRequest {
  name: string
  description?: string | null
  permissionIds?: number[]
}

export interface RoleUpdateRequest {
  name?: string | null
  description?: string | null
  permissionIds?: number[] | null
}
