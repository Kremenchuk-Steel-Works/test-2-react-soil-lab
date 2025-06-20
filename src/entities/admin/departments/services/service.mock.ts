import { mockDepartments } from '@/entities/admin/departments/mocks/mock'
import type {
  DepartmentDetailResponse,
  DepartmentListResponse,
} from '@/entities/admin/departments/types/response.dto'
import type { PageParams } from '@/types/pagination'

const mockData = mockDepartments

export const departmentsService = {
  async getList(params?: PageParams): Promise<DepartmentListResponse> {
    console.log(params)
    const responeData = {
      data: mockData,
      page: 1,
      totalPages: 1,
      totalItems: mockData.length,
    }
    return responeData
  },

  async getById(id: string): Promise<DepartmentDetailResponse> {
    const data = mockData.find((obj) => obj.id === id)

    if (!data) throw new Error(`Object with id ${id} not found`)

    return data
  },
}
