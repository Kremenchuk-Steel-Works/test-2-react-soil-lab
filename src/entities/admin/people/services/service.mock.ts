import { mockPeople } from '@/entities/admin/people/mocks/mock'
import type {
  PersonDetailResponse,
  PersonListResponse,
  PersonLookupResponse,
} from '@/entities/admin/people/types/response.dto'
import { logger } from '@/shared/lib/logger'
import type { PageParams } from '@/types/pagination'

const mockData = mockPeople

export const peopleMockService = {
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
      fullName: `${item.lastName} ${item.firstName}${item.middleName ? ' ' + item.middleName : ''}`,
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

  async getLookup(): Promise<PersonLookupResponse[]> {
    const newData = mockData.map((item) => ({
      ...item,
      fullName: `${item.lastName} ${item.firstName}${item.middleName ? ' ' + item.middleName : ''}`,
    }))
    return newData
  },

  async isUsernameAvailable(username: string): Promise<boolean> {
    logger.debug(`Checking username: "${username}"...`)

    // Имитация сетевой задержки
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const takenUsernames = ['максим', 'john'] // Имена в нижнем регистре
    const isTaken = takenUsernames.includes(username.toLowerCase())

    if (isTaken) {
      logger.debug(`Имя "${username}" занято.`)
      return false
    }

    logger.debug(`Имя "${username}" доступно.`)
    return true
  },
}
