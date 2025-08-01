// import { mockCities } from '@/entities/admin/city/mocks/mock'
// import type {
//   CityDetailResponse,
//   CityListResponse,
//   CityLookupResponse,
// } from '@/entities/admin/city/types/response.dto'
// import type { PageParams } from '@/types/pagination'

// const mockData = mockCities

// export const cityService = {
//   async getList(params?: PageParams): Promise<CityListResponse> {
//     console.log(params)
//     const responeData = {
//       data: mockData,
//       page: 1,
//       totalPages: 1,
//       totalItems: mockData.length,
//     }
//     return responeData
//   },

//   async getById(id: string): Promise<CityDetailResponse> {
//     const data = mockData.find((obj) => obj.id === Number(id))

//     if (!data) throw new Error('Object with id ${id} not found')

//     return data
//   },

//   async getLookup(): Promise<CityLookupResponse[]> {
//     const newData = mockData.map((item) => ({
//       ...item,
//       countryId: item.country.id,
//     }))
//     return newData
//   },
// }
