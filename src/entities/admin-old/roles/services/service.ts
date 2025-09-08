import { api } from '@/shared/api/client'
import type {
  RoleCreate,
  RoleDetailResponse,
  RoleListResponse,
  RoleLookupResponse,
  RoleUpdate,
} from '@/shared/api/soil-lab/model'
import { handleAxiosError } from '@/shared/lib/axios'
import type { PageParams } from '@/types/pagination'

export const roleService = {
  // Request
  async create(params: RoleCreate): Promise<RoleDetailResponse> {
    try {
      const response = await api.post<RoleDetailResponse>(`/roles/`, params)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async update(id: string, params: RoleUpdate): Promise<RoleDetailResponse> {
    try {
      const response = await api.put<RoleDetailResponse>(`/roles/${id}`, params)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  // Response
  async getList(params?: PageParams): Promise<RoleListResponse> {
    try {
      const response = await api.get<RoleListResponse>(`/roles`, { params })
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async getById(id: string): Promise<RoleDetailResponse> {
    try {
      const response = await api.get<RoleDetailResponse>(`/roles/${id}`)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async getLookup(): Promise<RoleLookupResponse[]> {
    try {
      const response = await api.get<RoleLookupResponse[]>(`/roles/lookups`)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },
}
