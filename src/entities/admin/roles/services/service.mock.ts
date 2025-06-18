import type { PageParams } from "../../../../types/pagination"
import { mockRoles } from "../mocks/mock"
import type {
  RoleDetailResponse,
  RoleListResponse,
  RoleLookupResponse,
} from "../types/response.dto"

const mockData = mockRoles

export const rolesService = {
  async getList(params?: PageParams): Promise<RoleListResponse> {
    console.log(params)
    const responeData = {
      data: mockData,
      page: 1,
      totalPages: 1,
      totalItems: mockData.length,
    }
    return responeData
  },

  async getById(id: string): Promise<RoleDetailResponse> {
    const data = mockData.find((obj) => obj.id === Number(id))

    if (!data) throw new Error(`Object with id ${id} not found`)

    return data
  },

  async getLookup(): Promise<RoleLookupResponse[]> {
    return mockData
  },
}
