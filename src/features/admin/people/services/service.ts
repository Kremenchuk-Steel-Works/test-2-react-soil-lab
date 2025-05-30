import type { PageParams } from "../../../../types/pagination"
import { mockPeople } from "../mocks/mock"
import type {
  PersonDetailResponse,
  PersonListResponse,
} from "../types/response.dto"

const mockData = mockPeople

export const peopleService = {
  async getList(params?: PageParams): Promise<PersonListResponse> {
    console.log(params)
    const newData = mockData.map((item) => ({
      ...item,
      id: item.id,
      firstName: item.firstName,
      middleName: item.middleName,
      lastName: item.lastName,
      gender: item.gender,
      birthDate: item.birthDate,
      photoUrl: item.photoUrl,
      isEmployee: !!item.employeeProfile,
      contactsCount: item.contacts.length,
      addressesCount: item.addresses.length,
      organizationNames: item.organizations.map((org) => org.legalName),
      positionNames: item.positions.map((pos) => pos.name),
      employeeStatus: item.employeeProfile?.employmentStatus ?? null,
      fullName: `${item.lastName} ${item.firstName}${
        item.middleName ? " " + item.middleName : ""
      }`,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }))
    const responeData = {
      data: newData,
      page: 1,
      totalPages: 1,
      totalItems: mockData.length,
    }
    return responeData
  },

  async getById(id: string): Promise<PersonDetailResponse> {
    console.log(id)
    const data = mockData.find((obj) => obj.id === id)

    if (!data) throw new Error(`Object with id ${id} not found`)

    return data
  },
}
