import {
  useCreateMoldPassportApiV1MoldPassportsPost,
  useDeleteMoldPassportApiV1MoldPassportsMoldPassportIdDelete,
  useGetMoldPassportApiV1MoldPassportsMoldPassportIdGet,
  useGetMoldPassportsListApiV1MoldPassportsGet,
  useUpdateMoldPassportApiV1MoldPassportsMoldPassportIdPut,
} from '@/shared/api/mold-passport/endpoints/mold-passports/mold-passports'

export const useMoldPassportService = {
  getList: useGetMoldPassportsListApiV1MoldPassportsGet,
  getById: useGetMoldPassportApiV1MoldPassportsMoldPassportIdGet,
  create: useCreateMoldPassportApiV1MoldPassportsPost,
  update: useUpdateMoldPassportApiV1MoldPassportsMoldPassportIdPut,
  delete: useDeleteMoldPassportApiV1MoldPassportsMoldPassportIdDelete,
}
