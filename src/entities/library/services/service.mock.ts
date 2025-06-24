import type { PageParams } from '@/types/pagination'
import { mockLibrary } from '../mocks/mock'
import type { LibraryDetailResponse, LibraryListResponse } from '../types/response.dto'

const mockData = mockLibrary

export const libraryService = {
  async getList(params?: PageParams): Promise<LibraryListResponse> {
    console.log(params)
    const newData = mockData.map((item) => ({
      ...item,
      id: item.id,
    }))
    const responseData = {
      data: newData,
      page: 1,
      totalPages: 1,
      totalItems: mockData.length,
    }
    return responseData
  },

  async getById(id: string): Promise<LibraryDetailResponse> {
    console.log(id)
    const data = mockData.find((obj) => obj.id === id)

    if (!data) throw new Error(`Object with id ${id} not found`)

    return data
  },
}
