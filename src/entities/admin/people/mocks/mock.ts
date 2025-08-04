import { addressOptions } from '@/entities/admin/address/types/address'
import { employeeProfileOptions } from '@/entities/admin/employeeProfile/types/employmentStatus'
import type { PersonDetailResponse } from '@/entities/admin/people/types/response.dto'

const mockAvatar = new File(['avatar'], 'avatar.png', { type: 'image/png' })

export const mockPeople: PersonDetailResponse[] = Array.from({ length: 10 }, (_, i) => {
  const timestamp = new Date().toISOString()

  return {
    id: `${i + 1}2a7a8bcf-5123-4466-a0f6-8bdbd21f8a91`,
    isUser: i % 2 === 0,
    firstName: `Ім'я${i}`,
    middleName: `По батькові${i}`,
    lastName: `Прізвище${i}`,
    gender: i % 2 === 0 ? 'male' : 'female',
    birthDate: `199${i}-01-01`,
    photoUrl: mockAvatar,
    createdAt: timestamp,
    updatedAt: timestamp,

    employeeProfile: {
      personId: `${i + 1}9b5a1bcf-5123-4466-a0f6-8bdbd21f8a91`,
      employeeNumber: `EMP${1000 + i}`,
      hiredAt: `2020-0${(i % 9) + 1}-15`,
      employmentStatus: employeeProfileOptions[i % employeeProfileOptions.length].value,
      createdAt: timestamp,
      updatedAt: timestamp,
    },

    contacts: [
      {
        id: `${i + 1}9b5a1bcf-5123-4466-a0f6-8bdbd21f8a91`,
        isPrimary: true,
        type: 'email',
        value: `user${i}@example.com`,
        note: 'Робочий email',
        createdAt: timestamp,
        updatedAt: timestamp,
      },
      {
        id: `${i + 1}9b5a1bcf-5123-4466-a0f6-8bdbd21f8a91`,
        isPrimary: false,
        type: 'phone',
        value: `+0123456789${i}`,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ],

    addresses: [
      {
        id: `${i + 1}9b5a1bcf-5123-4466-a0f6-8bdbd21f8a91`,
        fullAddress: `Вулиця ${i}`,
        city: {
          id: i,
          name: `Місто ${i}`,
          countryName: `Країна ${i}`,
          archivedAt: '',
        },
        postalCode: `1000${i}`,
        isPrimary: true,
        type: addressOptions[0]['value'],
        note: 'Основна адреса',
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    ],

    organizations: [
      {
        id: `${i + 1}2a7a8bcf-5123-4466-a0f6-8bdbd21f8a91`,
        legalName: `Company ${i + 1} LLC`,
        registrationNumber: `REG${i}00`,
        taxId: `TIN${i}00`,
        countryName: `Страна ${i}`,
      },
    ],

    positions: [
      {
        id: `${i + 1}9b5a1bcf-5123-4466-a0f6-8bdbd21f8a91`,
        name: `Посада ${i}`,
        description: `Опис посади ${i}`,
      },
    ],
    deletedAt: '',
  }
})
