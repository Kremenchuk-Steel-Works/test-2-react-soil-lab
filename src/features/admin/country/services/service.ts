import { api } from "../../../../api/client"
import { handleAxiosError } from "../../../../lib/axios"
import type { PageParams } from "../../../../types/pagination"
import type {
  CountryCreateRequest,
  CountryUpdateRequest,
} from "../types/request.dto"
import type {
  CountryDetailResponse,
  CountryListResponse,
  CountryLookupResponse,
} from "../types/response.dto"

export const countryService = {
  // Request
  async create(params: CountryCreateRequest): Promise<CountryDetailResponse> {
    try {
      const response = await api.post(`/counties/`, params)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async update(
    id: string,
    params: CountryUpdateRequest
  ): Promise<CountryDetailResponse> {
    try {
      const response = await api.put(`/counties/${id}`, params)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  // Response
  async getList(params?: PageParams): Promise<CountryListResponse> {
    try {
      const response = await api.get(`/counties`, { params })
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async getById(id: string): Promise<CountryDetailResponse> {
    try {
      const response = await api.get(`/counties/${id}`)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async getLookup(): Promise<CountryLookupResponse[]> {
    try {
      const response = await api.get(`/lookups/countries`)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },
}
