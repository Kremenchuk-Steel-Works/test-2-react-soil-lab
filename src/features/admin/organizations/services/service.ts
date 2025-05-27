import type { PageParams } from "../../../../types/pagination.types"
import { mockOrganizations } from "../mocks/mock"
import type {
  OrganizationListResponse,
  OrganizationResponse,
} from "../types/response.dto"

const mockData = mockOrganizations

export const organizationsService = {
  async getList(params?: PageParams): Promise<OrganizationListResponse> {
    console.log(params)
    const responeData = {
      data: mockData,
      page: 1,
      totalPages: 1,
      totalItems: mockData.length,
    }
    return responeData
  },

  async getById(id: string): Promise<OrganizationResponse> {
    console.log(id)
    const data = mockData.find((obj) => obj.id === id)

    if (!data) throw new Error(`Object with id ${id} not found`)

    return data
  },
}
