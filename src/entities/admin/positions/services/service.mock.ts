import { mockPositions } from '@/entities/admin/positions/mocks/mock'
import type {
  PositionDetailResponse,
  PositionListResponse,
  PositionLookupResponse,
} from '@/entities/admin/positions/types/response.dto'
import type { PageParams } from '@/types/pagination'

const mockData = mockPositions

export const positionsService = {
  async getList(params?: PageParams): Promise<PositionListResponse> {
    console.log(params)
    const responeData = {
      data: mockData,
      page: 1,
      totalPages: 1,
      totalItems: mockData.length,
    }
    return responeData
  },

  async getById(id: string): Promise<PositionDetailResponse> {
    const data = mockData.find((obj) => obj.id === id)

    if (!data) throw new Error(`Object with id ${id} not found`)

    return data
  },

  async getLookup(): Promise<PositionLookupResponse[]> {
    const newData = mockData.map((item) => ({
      ...item,
    }))
    return newData
  },
}
