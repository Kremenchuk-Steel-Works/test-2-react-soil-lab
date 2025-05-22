import type { PageParams } from "../types/common.api"
import { mockUsers } from "./mocks/users.mock"
import type { UsersListResponseDto } from "./types"

export const userService = {
  async getUsers(params?: PageParams): Promise<UsersListResponseDto> {
    console.log(params)
    return {
      users: mockUsers,
      page: 1,
      total_pages: 1,
      total_items: mockUsers.length,
    }
  },
}
