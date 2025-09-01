import type {
  PermissionCreateRequest,
  PermissionUpdateRequest,
} from '@/entities/admin/permissions/types/request.dto'
import type {
  PermissionDetailResponse,
  PermissionListResponse,
  PermissionLookupResponse,
} from '@/entities/admin/permissions/types/response.dto'
import { api } from '@/shared/api/client'
import { handleAxiosError } from '@/shared/lib/axios'
import type { PageParams } from '@/types/pagination'

export const permissionService = {
  // Request
  async create(params: PermissionCreateRequest): Promise<PermissionDetailResponse> {
    try {
      const response = await api.post<PermissionDetailResponse>(`/permissions/`, params)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async update(id: string, params: PermissionUpdateRequest): Promise<PermissionDetailResponse> {
    try {
      const response = await api.put<PermissionDetailResponse>(`/permissions/${id}`, params)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  // Response
  async getList(params?: PageParams): Promise<PermissionListResponse> {
    try {
      const response = await api.get<PermissionListResponse>(`/permissions`, { params })
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async getById(id: string): Promise<PermissionDetailResponse> {
    try {
      console.log(id)
      const response = await api.get<PermissionDetailResponse>(`/permissions/${id}`)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async getLookup(): Promise<PermissionLookupResponse[]> {
    try {
      const response = await api.get<PermissionLookupResponse[]>(`/lookups/permissions`)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },
}
