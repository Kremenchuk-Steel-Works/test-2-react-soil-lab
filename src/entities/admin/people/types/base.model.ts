import type { Gender } from '@/entities/admin/people/types/gender'

export interface PersonBase {
  firstName: string
  middleName?: string
  lastName: string
  gender: Gender
  birthDate?: string
  photoUrl?: File
}
