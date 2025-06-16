import { api } from "../../../../api/client"
import { handleAxiosError } from "../../../../lib/axios"
import type { PageParams } from "../../../../types/pagination"
import type {
  OrganizationCreateRequest,
  OrganizationUpdateRequest,
} from "../types/request.dto"
import type {
  OrganizationDetailResponse,
  OrganizationListResponse,
  OrganizationLookupResponse,
} from "../types/response.dto"

export const organizationService = {
  // Request
  async create(
    params: OrganizationCreateRequest
  ): Promise<OrganizationDetailResponse> {
    try {
      const response = await api.post(`/organizations/`, params)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async update(
    id: string,
    params: OrganizationUpdateRequest
  ): Promise<OrganizationDetailResponse> {
    try {
      const response = await api.put(`/organizations/${id}`, params)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  // Response
  async getList(params?: PageParams): Promise<OrganizationListResponse> {
    try {
      const response = await api.get(`/organizations`, { params })
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async getById(id: string): Promise<OrganizationDetailResponse> {
    try {
      const response = await api.get(`/organizations/${id}`)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async getLookup(): Promise<OrganizationLookupResponse[]> {
    try {
      const response = await api.get(`/lookups/organizations`)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },
}
