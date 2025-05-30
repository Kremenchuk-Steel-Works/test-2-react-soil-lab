import type { PageParams } from "../../../../types/pagination"
import { mockUsers } from "../mocks/mock"
import type {
  UserDetailResponse,
  UserListResponse,
} from "../types/response.dto"

const mockData = mockUsers

export const usersService = {
  async getList(params?: PageParams): Promise<UserListResponse> {
    console.log(params)
    const newData = mockData.map((item) => ({
      ...item,
      fullName: item.person.fullName,
      roleNames: item.roles.map((role) => role.name),
      permissionNames: item.permissions.map((permission) => permission.name),
    }))
    const responeData = {
      data: newData,
      page: 1,
      totalPages: 1,
      totalItems: mockData.length,
    }
    return responeData
  },

  async getById(id: string): Promise<UserDetailResponse> {
    console.log(id)
    const data = mockData.find((obj) => obj.id === id)

    if (!data) throw new Error(`Object with id ${id} not found`)

    return data
  },
}
