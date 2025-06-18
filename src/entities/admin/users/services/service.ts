import { api } from "../../../../shared/api/client"
import { handleAxiosError } from "../../../../shared/lib/axios"
import type { PageParams } from "../../../../types/pagination"
import type { UserCreateRequest, UserUpdateRequest } from "../types/request.dto"
import type {
  UserDetailResponse,
  UserListResponse,
} from "../types/response.dto"

export const userService = {
  // Request
  async create(params: UserCreateRequest): Promise<UserDetailResponse> {
    try {
      const response = await api.post(`/users/`, params)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async update(
    id: string,
    params: UserUpdateRequest
  ): Promise<UserDetailResponse> {
    try {
      const response = await api.put(`/users/${id}`, params)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  // Response
  async getList(params?: PageParams): Promise<UserListResponse> {
    try {
      const response = await api.get(`/users`, { params })
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async getById(id: string): Promise<UserDetailResponse> {
    try {
      console.log(id)
      const response = await api.get(`/users/${id}`)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async getMe(): Promise<UserDetailResponse> {
    try {
      const response = await api.get(`/users/me`)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },
}
