import type {
  PositionCreateRequest,
  PositionUpdateRequest,
} from '@/entities/admin-old/positions/types/request.dto'
import type {
  PositionDetailResponse,
  PositionListResponse,
  PositionLookupResponse,
} from '@/entities/admin-old/positions/types/response.dto'
import { api } from '@/shared/api/client'
import { handleAxiosError } from '@/shared/lib/axios'
import type { PageParams } from '@/types/pagination'

export const positionService = {
  // Request
  async create(params: PositionCreateRequest): Promise<PositionDetailResponse> {
    try {
      const response = await api.post<PositionDetailResponse>(`/positions/`, params)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async update(id: string, params: PositionUpdateRequest): Promise<PositionDetailResponse> {
    try {
      const response = await api.put<PositionDetailResponse>(`/positions/${id}`, params)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  // Response
  async getList(params?: PageParams): Promise<PositionListResponse> {
    try {
      const response = await api.get<PositionListResponse>(`/positions`, { params })
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async getById(id: string): Promise<PositionDetailResponse> {
    try {
      const response = await api.get<PositionDetailResponse>(`/positions/${id}`)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async getLookup(): Promise<PositionLookupResponse[]> {
    try {
      const response = await api.get<PositionLookupResponse[]>(`/lookups/positions`)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },
}
