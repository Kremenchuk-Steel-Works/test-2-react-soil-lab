import { getMoldPassportsMock } from '@/shared/api/mold-passport/endpoints/mold-passports/mold-passports.msw'

export const handlers = [...getMoldPassportsMock()]
