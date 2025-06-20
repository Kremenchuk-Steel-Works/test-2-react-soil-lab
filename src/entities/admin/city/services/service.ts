import { api } from '@/shared/api/client'
import { handleAxiosError } from '@/shared/lib/axios'
import type { PageParams } from '@/types/pagination'
import type { CityCreateRequest, CityUpdateRequest } from '@/entities/admin/city/types/request.dto'
import type {
  CityDetailResponse,
  CityListResponse,
  CityLookupResponse,
} from '@/entities/admin/city/types/response.dto'

export const cityService = {
  // Request
  async create(params: CityCreateRequest): Promise<CityDetailResponse> {
    try {
      const response = await api.post(`/cities/`, params)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async update(
    id: string,
    params: CityUpdateRequest
  ): Promise<CityDetailResponse> {
    try {
      const response = await api.put(`/cities/${id}`, params)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  // Response
  async getList(params?: PageParams): Promise<CityListResponse> {
    try {
      const response = await api.get(`/cities`, { params })
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async getById(id: string): Promise<CityDetailResponse> {
    try {
      const response = await api.get(`/cities/${id}`)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async getLookup(): Promise<CityLookupResponse[]> {
    try {
      const response = await api.get(`/lookups/cities`)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },
}
