import { api } from "../api/client"
import type {
  UserDetailResponse,
  UserShortResponse,
} from "../features/admin/users/types/response.dto"
import type { PageParams } from "../types/pagination"
import { handleAxiosError } from "../utils/handleAxiosError"

export async function apiUsersMe() {
  try {
    const response = await api.get(`/users/me`)
    const user: UserDetailResponse = response.data
    return user
  } catch (err) {
    handleAxiosError(err)
  }
}

export async function apiUsers(params?: PageParams) {
  try {
    const response = await api.get(`/users`, { params })
    const usersData: UserShortResponse = response.data
    return usersData
  } catch (err) {
    handleAxiosError(err)
  }
}

// export async function apiUsersAdd({
//   email,
//   rawPassword,
//   profile,
// }: UserCreateRequest) {
//   try {
//     const response = await api.post(`/users/`, {
//       email,
//       rawPassword,
//       profile,
//     })
//     const user: UserDetailResponse = response.data
//     return user
//   } catch (err) {
//     handleAxiosError(err)
//   }
// }

export async function apiUsersDetail(id: string) {
  try {
    const response = await api.get(`/users/${id}`)
    const user: UserDetailResponse = response.data
    return user
  } catch (err) {
    handleAxiosError(err)
  }
}

// export async function apiUsersEdit(
//   id: string,
//   { email, profile }: UserUpdateRequest
// ) {
//   try {
//     const response = await api.put(`/users/${id}`, {
//       email,
//       profile,
//     })
//     const user: UserDetailResponse = response.data
//     return user
//   } catch (err) {
//     handleAxiosError(err)
//   }
// }
