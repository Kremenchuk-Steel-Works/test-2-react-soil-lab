import type {
  DepartmentCreateRequest,
  DepartmentUpdateRequest,
} from '@/entities/admin-old/departments/types/request.dto'
import type {
  DepartmentDetailResponse,
  DepartmentListResponse,
  DepartmentLookupResponse,
} from '@/entities/admin-old/departments/types/response.dto'
import { api } from '@/shared/api/client'
import { handleAxiosError } from '@/shared/lib/axios'
import type { PageParams } from '@/types/pagination'

export const departmentService = {
  // Request
  async create(params: DepartmentCreateRequest): Promise<DepartmentDetailResponse> {
    try {
      const response = await api.post<DepartmentDetailResponse>(`/departments/`, params)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async update(id: string, params: DepartmentUpdateRequest): Promise<DepartmentDetailResponse> {
    try {
      const response = await api.put<DepartmentDetailResponse>(`/departments/${id}`, params)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  // Response
  async getList(params?: PageParams): Promise<DepartmentListResponse> {
    try {
      const response = await api.get<DepartmentListResponse>(`/departments`, { params })
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async getById(id: string): Promise<DepartmentDetailResponse> {
    try {
      const response = await api.get<DepartmentDetailResponse>(`/departments/${id}`)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },

  async getLookup(): Promise<DepartmentLookupResponse[]> {
    try {
      const response = await api.get<DepartmentLookupResponse[]>(`/lookups/departments`)
      return response.data
    } catch (err) {
      handleAxiosError(err)
    }
  },
}
