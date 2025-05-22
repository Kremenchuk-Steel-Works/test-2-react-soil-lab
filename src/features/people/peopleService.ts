import type { PageParams } from "../types/common.api"
import { mockPeople } from "./mocks/people.mock"
import type { PeopleListResponseDto } from "./types"

export const peopleService = {
  async getPeople(params?: PageParams): Promise<PeopleListResponseDto> {
    console.log(params)
    return {
      people: mockPeople,
      page: 1,
      total_pages: 1,
      total_items: mockPeople.length,
    }
  },
}
