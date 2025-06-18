import type { Gender } from "./gender"

export interface PersonBase {
  firstName: string
  middleName?: string
  lastName: string
  gender: Gender
  birthDate?: string
  photoUrl?: File
}
