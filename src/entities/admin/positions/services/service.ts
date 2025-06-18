import { api } from "../../../../shared/api/client"
import { handleAxiosError } from "../../../../shared/lib/axios"
import type { PageParams } from "../../../../types/pagination"
import type {
  PositionCreateRequest,
  PositionUpdateRequest,
} from "../types/request.dto"
import type {
  PositionDetailResponse,
  PositionListResponse,
  PositionLookupResponse,
} from "../types/response.dto"

export const positionService = {
  // Request
  async create(params: PositionCreateRequest): Promise<PositionDetailResponse> {
    try {
      const response = await api.post(`/positions/`, params)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async update(
    id: string,
    params: PositionUpdateRequest
  ): Promise<PositionDetailResponse> {
    try {
      const response = await api.put(`/positions/${id}`, params)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  // Response
  async getList(params?: PageParams): Promise<PositionListResponse> {
    try {
      const response = await api.get(`/positions`, { params })
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async getById(id: string): Promise<PositionDetailResponse> {
    try {
      const response = await api.get(`/positions/${id}`)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async getLookup(): Promise<PositionLookupResponse[]> {
    try {
      const response = await api.get(`/lookups/positions`)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },
}
