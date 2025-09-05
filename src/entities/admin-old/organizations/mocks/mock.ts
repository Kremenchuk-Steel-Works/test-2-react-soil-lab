import type { OrganizationDetailResponse } from '@/entities/admin-old/organizations/types/response.dto'

export const mockOrganizations: OrganizationDetailResponse[] = Array.from(
  { length: 100000 },
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
        isoAlpha2: `C${i + 1}`,
        isoAlpha3: `C${i + 1}`,
        isoNumeric: `C${i + 1}`,
        name: `Country ${i + 1}`,
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
          fullAddress: `Main St. ${i + 1}`,
          city: {
            id: i,
            name: `Місто ${i}`,
            countryName: `Країна ${i}`,
            archivedAt: '',
          },
          postalCode: `1000${i}`,
          isPrimary: true,
          type: 'office',
          note: 'Headquarters',
          createdAt: timestamp,
          updatedAt: timestamp,
        },
        {
          id: `addr-${i}-2`,
          fullAddress: `Branch Ave. ${i + 1}`,
          city: {
            id: i,
            name: `Місто ${i}`,
            countryName: `Країна ${i}`,
            archivedAt: '',
          },
          isPrimary: false,
          type: 'billing',
          note: 'Billing address',
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ],
      archivedAt: '',
    }
  },
)
