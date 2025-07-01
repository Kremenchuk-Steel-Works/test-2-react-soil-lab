import { mockOrganizations } from '@/entities/admin/organizations/mocks/mock'
import type {
  OrganizationDetailResponse,
  OrganizationListResponse,
  OrganizationLookupResponse,
} from '@/entities/admin/organizations/types/response.dto'
import type { PageParams } from '@/types/pagination'

export interface PaginatedLookupResponse<T> {
  options: T[]
  hasMore: boolean
  totalPages: number
}
const mockData = mockOrganizations

export const organizationMockService = {
  async getList(params?: PageParams): Promise<OrganizationListResponse> {
    console.log(params)
    const newData = mockData.map((item) => ({
      ...item,
      countryName: item.country.name ?? item.country.nameLocal ?? '',
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

  /**
   * Получает пагинированный список организаций для селекта с поиском.
   * @param search - Поисковая строка для фильтрации по имени.
   * @param page - Номер страницы (начиная с 1).
   * @param perPage - (Опционально) Количество элементов на странице. По умолчанию 15.
   */
  async getPaginatedLookup(
    search: string,
    page: number,
    perPage: number = 20,
  ): Promise<PaginatedLookupResponse<OrganizationLookupResponse>> {
    console.log(`Fetching page: ${page}, search: "${search}", perPage: ${perPage}`)

    await new Promise((resolve) => setTimeout(resolve, 300))

    const filteredData = mockData.filter((item) =>
      item.legalName.toLowerCase().includes(search.toLowerCase()),
    )

    const startIndex = (page - 1) * perPage
    const endIndex = startIndex + perPage
    const paginatedItems = filteredData.slice(startIndex, endIndex)

    const hasMore = endIndex < filteredData.length

    const response = {
      options: paginatedItems,
      hasMore,
      totalPages: Math.ceil(filteredData.length / perPage),
    }

    return response
  },
}
