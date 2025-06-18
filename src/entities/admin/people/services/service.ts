import { api } from "../../../../shared/api/client"
import { handleAxiosError } from "../../../../shared/lib/axios"
import type { PageParams } from "../../../../types/pagination"
import type {
  PersonCreateRequest,
  PersonUpdateRequest,
} from "../types/request.dto"
import type {
  PersonDetailResponse,
  PersonListResponse,
  PersonLookupResponse,
} from "../types/response.dto"

export const personService = {
  // Request
  async create(params: PersonCreateRequest): Promise<PersonDetailResponse> {
    try {
      const response = await api.post(`/people/`, params)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async update(
    id: string,
    params: PersonUpdateRequest
  ): Promise<PersonDetailResponse> {
    try {
      const response = await api.put(`/people/${id}`, params)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  // Response
  async getList(params?: PageParams): Promise<PersonListResponse> {
    try {
      const response = await api.get(`/people`, { params })
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async getById(id: string): Promise<PersonDetailResponse> {
    try {
      const response = await api.get(`/people/${id}`)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async getLookup(): Promise<PersonLookupResponse[]> {
    try {
      const response = await api.get(`/lookups/people`)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },
}
