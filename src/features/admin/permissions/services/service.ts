import type { PageParams } from "../../../../types/pagination.types"
import { mockPermissions } from "../mocks/mock"
import type { Permission, PermissionsListResponse } from "../types"

const mockData = mockPermissions

export const permissionsService = {
  async getList(params?: PageParams): Promise<PermissionsListResponse> {
    console.log(params)
    const responeData = {
      permissions: mockData,
      page: 1,
      totalPages: 1,
      totalItems: mockData.length,
    }
    return responeData
  },

  async getById(id: string): Promise<Permission> {
    const data = mockData.find((obj) => obj.id === id)

    if (!data) throw new Error(`Object with id ${id} not found`)

    return data
  },
}
