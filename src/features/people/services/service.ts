import type { PageParams } from "../../../types/pagination.types"
import { mockPeople } from "../mocks/mock"
import type { PeopleListResponse, Person } from "../types"

const mockData = mockPeople

export const peopleService = {
  async getList(params?: PageParams): Promise<PeopleListResponse> {
    console.log(params)
    const responeData = {
      people: mockData,
      page: 1,
      totalPages: 1,
      totalItems: mockData.length,
    }
    return responeData
  },

  async getById(id: string): Promise<Person> {
    console.log(id)
    const data = mockData.find((obj) => obj.id === id)

    if (!data) throw new Error(`Object with id ${id} not found`)

    return data
  },
}
