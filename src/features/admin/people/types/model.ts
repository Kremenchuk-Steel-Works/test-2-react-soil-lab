export type Person = {
  id: string
  firstName: string
  middleName?: string
  lastName: string
  gender: "male" | "female" | "other"
  birthDate?: string
  photoUrl?: string
  email?: string
  phoneNumber?: string
  createdAt: string
  updatedAt: string
}
