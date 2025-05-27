import type { PageParams } from "../../../../types/pagination.types"
import { mockDepartments } from "../mocks/mock"
import type {
  DepartmentResponse,
  DepartmentsListResponse,
} from "../types/response.dto"

const mockData = mockDepartments

export const departmentsService = {
  async getList(params?: PageParams): Promise<DepartmentsListResponse> {
    console.log(params)
    const responeData = {
      data: mockData,
      page: 1,
      totalPages: 1,
      totalItems: mockData.length,
    }
    return responeData
  },

  async getById(id: string): Promise<DepartmentResponse> {
    const data = mockData.find((obj) => obj.id === id)

    if (!data) throw new Error(`Object with id ${id} not found`)

    return data
  },
}
