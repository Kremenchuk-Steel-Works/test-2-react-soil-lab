import type { PageParams } from "../../../../types/pagination"
import { mockCountries } from "../mocks/mock"
import type {
  CountryDetailResponse,
  CountryListResponse,
  CountryLookupResponse,
} from "../types/response.dto"

const mockData = mockCountries

export const countryService = {
  async getList(params?: PageParams): Promise<CountryListResponse> {
    console.log(params)
    const responeData = {
      data: mockData,
      page: 1,
      totalPages: 1,
      totalItems: mockData.length,
    }
    return responeData
  },

  async getById(id: string): Promise<CountryDetailResponse> {
    const data = mockData.find((obj) => obj.id === Number(id))

    if (!data) throw new Error(`Object with id ${id} not found`)

    return data
  },

  async getLookup(): Promise<CountryLookupResponse[]> {
    const newData = mockData.map((item) => ({
      ...item,
    }))
    return newData
  },
}
