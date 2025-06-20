import type { OrganizationDetailResponse } from '@/entities/admin/organizations/types/response.dto'

export const mockOrganizations: OrganizationDetailResponse[] = Array.from(
  { length: 10 },
  (_, i) => {
    const id = `${i + 1}2a7a8bcf-5123-4466-a0f6-8bdbd21f8a91`
    const timestamp = new Date().toISOString()

    return {
      id,
      legalName: `Company ${i + 1} LLC`,
      registrationNumber: `REG-${1000 + i}`,
      taxId: `TAX-${2000 + i}`,
      createdAt: timestamp,
      updatedAt: timestamp,

      country: {
        id: 100 + i,
        code: `C${i + 1}`,
        name: `Country ${i + 1}`,
        nameLocal: `Країна ${i + 1}`,
      },

      contacts: [
        {
          id: `contact-${i}-1`,
          type: 'email',
          value: `info${i}@company.com`,
          note: 'General inquiries',
          isPrimary: true,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        {
          id: `contact-${i}-2`,
          type: 'phone',
          value: `+1234567890${i}`,
          note: 'Main line',
          isPrimary: false,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ],

      addresses: [
        {
          id: `addr-${i}-1`,
          street: `Main St. ${i + 1}`,
          cityId: i + 1000,
          cityName: `City ${i + 1}`,
          countryName: `Country ${i + 1}`,
          postalCode: `1000${i}`,
          isPrimary: true,
          type: 'office',
          note: 'Headquarters',
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        {
          id: `addr-${i}-2`,
          street: `Branch Ave. ${i + 1}`,
          cityId: i + 2000,
          cityName: `Subcity ${i + 1}`,
          countryName: `Country ${i + 1}`,
          isPrimary: false,
          type: 'billing',
          note: 'Billing address',
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ],
    }
  },
)
