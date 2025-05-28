export interface RoleCreateRequest {
  name: string
  description?: string | undefined
  permissionIds?: number[]
}

export interface RoleUpdateRequest {
  name?: string | undefined
  description?: string | undefined
  permissionIds?: number[] | undefined
}
