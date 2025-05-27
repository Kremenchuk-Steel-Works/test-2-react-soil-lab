export interface UserCreateRequest {
  email: string
  personId: string
  rawPassword: string
  isActive?: boolean | null
  isSuperuser?: boolean | null
}

export interface UserUpdateRequest {
  email?: string | null
  isActive?: boolean | null
  isSuperuser?: boolean | null
}
