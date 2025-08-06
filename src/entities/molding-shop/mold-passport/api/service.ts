import {
  createMoldPassportApiV1MoldPassportsPost,
  getGetMoldPassportApiV1MoldPassportsMoldPassportIdGetQueryOptions,
  getGetMoldPassportsListApiV1MoldPassportsGetQueryOptions,
  updateMoldPassportApiV1MoldPassportsMoldPassportIdPut,
} from '@/shared/api/mold-passport/endpoints/mold-passports/mold-passports'

export const moldPassportService = {
  getList: getGetMoldPassportsListApiV1MoldPassportsGetQueryOptions,
  getById: getGetMoldPassportApiV1MoldPassportsMoldPassportIdGetQueryOptions,
  create: createMoldPassportApiV1MoldPassportsPost,
  update: updateMoldPassportApiV1MoldPassportsMoldPassportIdPut,
}
