export type User = {
  email: string
  id: number
  profile: {
    first_name: string
    last_name: string
    employee_number: string
    id: number
    user_id: number
    created_at: string
    updated_at: string
  }
  roles: {
    name: string
    description: string
    id: number
  }[]
  permissions: {
    name: string
    description: string
    id: number
  }[]
  created_at: string
  updated_at: string
}

export type UsersData = {
  page: number
  total_items: number
  total_pages: number
  users: Omit<User, "permissions" | "created_at" | "updated_at">[]
}

export type UsersAdd = {
  email: string
  raw_password: string
  profile: {
    first_name: string
    last_name: string
    employee_number: string
  }
}

export type UsersEdit = Omit<UsersAdd, "raw_password">
