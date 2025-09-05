import type {
  RoleCreateRequest,
  RoleUpdateRequest,
} from '@/entities/admin-old/roles/types/request.dto'
import type {
  RoleDetailResponse,
  RoleListResponse,
  RoleLookupResponse,
} from '@/entities/admin-old/roles/types/response.dto'
import { api } from '@/shared/api/client'
import { handleAxiosError } from '@/shared/lib/axios'
import type { PageParams } from '@/types/pagination'

export const roleService = {
  // Request
  async create(params: RoleCreateRequest): Promise<RoleDetailResponse> {
    try {
      const response = await api.post<RoleDetailResponse>(`/roles/`, params)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async update(id: string, params: RoleUpdateRequest): Promise<RoleDetailResponse> {
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
      const response = await api.get<RoleLookupResponse[]>(`/lookups/roles`)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },
}
