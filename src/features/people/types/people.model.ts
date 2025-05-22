export type Person = {
  id: string
  first_name: string
  middle_name?: string
  last_name: string
  gender: "male" | "female" | "other"
  birth_date?: string
  photo_url?: string
  email?: string
  phone_number?: string
  created_at: string
  updated_at: string
}
