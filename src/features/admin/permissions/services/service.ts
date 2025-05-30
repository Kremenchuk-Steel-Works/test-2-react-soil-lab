import type { PageParams } from "../../../../types/pagination"
import { mockPermissions } from "../mocks/mock"
import type {
  PermissionDetailResponse,
  PermissionListResponse,
} from "../types/response.dto"

const mockData = mockPermissions

export const permissionsService = {
  async getList(params?: PageParams): Promise<PermissionListResponse> {
    console.log(params)
    const newData = mockData.map((item) => ({
      ...item,
      departmentName: item.department.name,
    }))
    const responeData = {
      data: newData,
      page: 1,
      totalPages: 1,
      totalItems: mockData.length,
    }
    return responeData
  },

  async getById(id: string): Promise<PermissionDetailResponse> {
    const data = mockData.find((obj) => obj.id === Number(id))

    if (!data) throw new Error(`Object with id ${id} not found`)

    return data
  },
}
