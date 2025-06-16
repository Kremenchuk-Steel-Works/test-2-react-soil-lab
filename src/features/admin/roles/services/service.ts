import { api } from "../../../../api/client"
import { handleAxiosError } from "../../../../lib/axios"
import type { PageParams } from "../../../../types/pagination"
import type { RoleCreateRequest, RoleUpdateRequest } from "../types/request.dto"
import type {
  RoleDetailResponse,
  RoleListResponse,
  RoleLookupResponse,
} from "../types/response.dto"

export const roleService = {
  // Request
  async create(params: RoleCreateRequest): Promise<RoleDetailResponse> {
    try {
      const response = await api.post(`/roles/`, params)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async update(
    id: string,
    params: RoleUpdateRequest
  ): Promise<RoleDetailResponse> {
    try {
      const response = await api.put(`/roles/${id}`, params)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  // Response
  async getList(params?: PageParams): Promise<RoleListResponse> {
    try {
      const response = await api.get(`/roles`, { params })
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async getById(id: string): Promise<RoleDetailResponse> {
    try {
      const response = await api.get(`/roles/${id}`)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async getLookup(): Promise<RoleLookupResponse[]> {
    try {
      const response = await api.get(`/lookups/roles`)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },
}
