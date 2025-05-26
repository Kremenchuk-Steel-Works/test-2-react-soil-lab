import type { PageParams } from "../../../../types/pagination.types"
import { mockPositions } from "../mocks/mock"
import type { Position, PositionsListResponse } from "../types"

const mockData = mockPositions

export const positionsService = {
  async getList(params?: PageParams): Promise<PositionsListResponse> {
    console.log(params)
    const responeData = {
      positions: mockData,
      page: 1,
      totalPages: 1,
      totalItems: mockData.length,
    }
    return responeData
  },

  async getById(id: string): Promise<Position> {
    const data = mockData.find((obj) => obj.id === id)

    if (!data) throw new Error(`Object with id ${id} not found`)

    return data
  },
}
