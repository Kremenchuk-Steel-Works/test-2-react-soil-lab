import type { PageParams } from "../../../../types/pagination"
import { mockOrganizations } from "../mocks/mock"
import type {
  OrganizationDetailResponse,
  OrganizationListResponse,
  OrganizationLookupResponse,
} from "../types/response.dto"

const mockData = mockOrganizations

export const organizationsService = {
  async getList(params?: PageParams): Promise<OrganizationListResponse> {
    console.log(params)
    const newData = mockData.map((item) => ({
      ...item,
      countryName: item.country.name ?? item.country.nameLocal ?? "",
    }))
    const responeData = {
      data: newData,
      page: 1,
      totalPages: 1,
      totalItems: mockData.length,
    }
    return responeData
  },

  async getById(id: string): Promise<OrganizationDetailResponse> {
    console.log(id)
    const data = mockData.find((obj) => obj.id === id)

    if (!data) throw new Error(`Object with id ${id} not found`)

    return data
  },

  async getLookup(): Promise<OrganizationLookupResponse[]> {
    const newData = mockData.map((item) => ({
      ...item,
    }))
    return newData
  },
}
