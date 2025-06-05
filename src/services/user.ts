import { api } from "../api/client"
import type { User, UsersAdd, UsersData, UsersEdit } from "../types/user"
import type { PageParams } from "../types/pagination"
import { handleAxiosError } from "../utils/handleAxiosError"

export async function apiUsersMe() {
  try {
    const response = await api.get(`/users/me`)
    const user: User = response.data
    return user
  } catch (err) {
    handleAxiosError(err)
  }
}

export async function apiUsers(params?: PageParams) {
  try {
    const response = await api.get(`/users`, { params })
    const usersData: UsersData = response.data
    return usersData
  } catch (err) {
    handleAxiosError(err)
  }
}

export async function apiUsersAdd({ email, rawPassword, profile }: UsersAdd) {
  try {
    const response = await api.post(`/users/`, {
      email,
      rawPassword,
      profile,
    })
    const user: User = response.data
    return user
  } catch (err) {
    handleAxiosError(err)
  }
}

export async function apiUsersDetail(id: string) {
  try {
    const response = await api.get(`/users/${id}`)
    const user: User = response.data
    return user
  } catch (err) {
    handleAxiosError(err)
  }
}

export async function apiUsersEdit(id: string, { email, profile }: UsersEdit) {
  try {
    const response = await api.put(`/users/${id}`, {
      email,
      profile,
    })
    const user: User = response.data
    return user
  } catch (err) {
    handleAxiosError(err)
  }
}
