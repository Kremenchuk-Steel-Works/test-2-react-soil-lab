import type { PageParams } from "../../../types/pagination.types"
import { mockUsers } from "../mocks/mock"
import type { User, UsersListResponse } from "../types"

const mockData = mockUsers

export const usersService = {
  async getList(params?: PageParams): Promise<UsersListResponse> {
    console.log(params)
    const responeData = {
      users: mockData,
      page: 1,
      totalPages: 1,
      totalItems: mockData.length,
    }
    return responeData
  },

  async getById(id: string): Promise<User> {
    console.log(id)
    const data = mockData.find((obj) => obj.id === id)

    if (!data) throw new Error(`Object with id ${id} not found`)

    return data
  },
}
