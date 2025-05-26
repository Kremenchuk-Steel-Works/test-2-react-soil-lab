import type { PageParams } from "../../../../types/pagination.types"
import { mockOrganizations } from "../mocks/mock"
import type { Organization, OrganizationsListResponse } from "../types"

const mockData = mockOrganizations

export const organizationsService = {
  async getList(params?: PageParams): Promise<OrganizationsListResponse> {
    console.log(params)
    const responeData = {
      organizations: mockData,
      page: 1,
      totalPages: 1,
      totalItems: mockData.length,
    }
    return responeData
  },

  async getById(id: string): Promise<Organization> {
    console.log(id)
    const data = mockData.find((obj) => obj.id === id)

    if (!data) throw new Error(`Object with id ${id} not found`)

    return data
  },
}
