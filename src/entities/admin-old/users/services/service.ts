import { api } from '@/shared/api/client'
import type {
  UserCreate,
  UserDetailResponse,
  UserListResponse,
  UserUpdate,
} from '@/shared/api/soil-lab/model'
import { handleAxiosError } from '@/shared/lib/axios'
import type { PageParams } from '@/types/pagination'

export const userService = {
  // Request
  async create(params: UserCreate): Promise<UserDetailResponse> {
    try {
      const response = await api.post<UserDetailResponse>(`/users/`, params)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async update(id: string, params: UserUpdate): Promise<UserDetailResponse> {
    try {
      const response = await api.put<UserDetailResponse>(`/users/${id}`, params)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  // Response
  async getList(params?: PageParams): Promise<UserListResponse> {
    try {
      const response = await api.get<UserListResponse>(`/users`, { params })
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async getById(id: string): Promise<UserDetailResponse> {
    try {
      console.log(id)
      const response = await api.get<UserDetailResponse>(`/users/${id}`)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async getMe(): Promise<UserDetailResponse> {
    try {
      const response = await api.get<UserDetailResponse>(`/users/me`)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },
}
