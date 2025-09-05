import type {
  OrganizationCreateRequest,
  OrganizationUpdateRequest,
} from '@/entities/admin-old/organizations/types/request.dto'
import type {
  OrganizationDetailResponse,
  OrganizationListResponse,
  OrganizationLookupResponse,
} from '@/entities/admin-old/organizations/types/response.dto'
import { api } from '@/shared/api/client'
import { handleAxiosError } from '@/shared/lib/axios'
import type { PageParams } from '@/types/pagination'

export const organizationService = {
  // Request
  async create(params: OrganizationCreateRequest): Promise<OrganizationDetailResponse> {
    try {
      const response = await api.post<OrganizationDetailResponse>(`/organizations/`, params)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async update(id: string, params: OrganizationUpdateRequest): Promise<OrganizationDetailResponse> {
    try {
      const response = await api.put<OrganizationDetailResponse>(`/organizations/${id}`, params)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  // Response
  async getList(params?: PageParams): Promise<OrganizationListResponse> {
    try {
      const response = await api.get<OrganizationListResponse>(`/organizations`, { params })
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async getById(id: string): Promise<OrganizationDetailResponse> {
    try {
      const response = await api.get<OrganizationDetailResponse>(`/organizations/${id}`)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async getLookup(): Promise<OrganizationLookupResponse[]> {
    try {
      const response = await api.get<OrganizationLookupResponse[]>(`/lookups/organizations`)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },
}
