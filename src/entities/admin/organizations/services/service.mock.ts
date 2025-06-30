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
const PAGE_SIZE = 15
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
   */
  async getPaginatedLookup(
    search: string,
    page: number,
  ): Promise<PaginatedLookupResponse<OrganizationLookupResponse>> {
    console.log(`Fetching page: ${page}, search: "${search}"`)

    // Имитация задержки сети
    await new Promise((resolve) => setTimeout(resolve, 300))

    const filteredData = mockData.filter((item) =>
      item.legalName.toLowerCase().includes(search.toLowerCase()),
    )

    const startIndex = (page - 1) * PAGE_SIZE
    const endIndex = startIndex + PAGE_SIZE
    const paginatedItems = filteredData.slice(startIndex, endIndex)

    const hasMore = endIndex < filteredData.length

    const response = {
      options: paginatedItems,
      hasMore,
      totalPages: Math.ceil(filteredData.length / PAGE_SIZE),
    }

    return response
  },

  /**
   * Получает список организаций по массиву их идентификаторов.
   * Корректная и эффективная реализация.
   * @param ids - Массив ID организаций для поиска.
   */
  async getLookupByIds(ids: string[]): Promise<OrganizationLookupResponse[]> {
    console.log(`[Mock] Fetching organizations by ${ids.length} IDs:`, ids)
    await new Promise((resolve) => setTimeout(resolve, 50)) // Меньшая задержка для быстрого ответа

    if (!ids || ids.length === 0) {
      return []
    }

    // Используем Map для эффективного поиска.
    // Сохраняем порядок исходного массива ids.
    const organizationsByIdMap = new Map<string, OrganizationDetailResponse>(
      mockOrganizations.map((org) => [org.id, org]),
    )
    const result = ids
      .map((id) => organizationsByIdMap.get(id)) // O(1) операция для каждого ID
      .filter((org): org is OrganizationDetailResponse => !!org) // Убираем undefined, если ID не найден
      .map((org) => ({
        // Преобразуем в формат OrganizationLookupResponse
        id: org.id,
        legalName: org.legalName,
      }))

    console.log('[Mock] Found organizations:', result)
    return result
  },
}
