import {
  useCreateMoldPassportApiV1MoldPassportsPost,
  useUpdateMoldPassportApiV1MoldPassportsMoldPassportIdPut,
} from '@/shared/api/mold-passport/endpoints/mold-passports/mold-passports'

export const authService = {
  login: useCreateMoldPassportApiV1MoldPassportsPost,
  refresh: useUpdateMoldPassportApiV1MoldPassportsMoldPassportIdPut,
}
