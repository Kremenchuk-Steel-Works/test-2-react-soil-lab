export interface UserCreateRequest {
  email: string
  personId: string
  rawPassword: string
  isActive?: boolean | undefined
  isSuperuser?: boolean | undefined
}

export interface UserUpdateRequest {
  email?: string | undefined
  isActive?: boolean | undefined
  isSuperuser?: boolean | undefined
}
