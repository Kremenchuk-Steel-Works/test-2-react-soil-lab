import type { CityCreateRequest, CityUpdateRequest } from '@/entities/admin/city/types/request.dto'
import type {
  CityDetailResponse,
  CityListResponse,
  CityLookupResponse,
} from '@/entities/admin/city/types/response.dto'
import { api } from '@/shared/api/client'
import { handleAxiosError } from '@/shared/lib/axios'
import type { PageParams } from '@/types/pagination'

export const cityService = {
  // Request
  async create(params: CityCreateRequest): Promise<CityDetailResponse> {
    try {
      const response = await api.post<CityDetailResponse>(`/cities/`, params)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async update(id: string, params: CityUpdateRequest): Promise<CityDetailResponse> {
    try {
      const response = await api.put<CityDetailResponse>(`/cities/${id}`, params)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  // Response
  async getList(params?: PageParams): Promise<CityListResponse> {
    try {
      const response = await api.get<CityListResponse>(`/cities`, { params })
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async getById(id: string): Promise<CityDetailResponse> {
    try {
      const response = await api.get<CityDetailResponse>(`/cities/${id}`)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async getLookup(): Promise<CityLookupResponse[]> {
    try {
      const response = await api.get<CityLookupResponse[]>(`/lookups/cities`)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },
}
