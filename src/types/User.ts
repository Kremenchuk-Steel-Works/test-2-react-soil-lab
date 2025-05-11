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
