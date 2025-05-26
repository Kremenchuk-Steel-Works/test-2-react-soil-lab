import type { PageParams } from "../../../../types/pagination.types"
import { mockRoles } from "../mocks/mock"
import type { Role, RolesListResponse } from "../types"

const mockData = mockRoles

export const rolesService = {
  async getList(params?: PageParams): Promise<RolesListResponse> {
    console.log(params)
    const responeData = {
      roles: mockData,
      page: 1,
      totalPages: 1,
      totalItems: mockData.length,
    }
    return responeData
  },

  async getById(id: string): Promise<Role> {
    const data = mockData.find((obj) => obj.id === id)

    if (!data) throw new Error(`Object with id ${id} not found`)

    return data
  },
}
