import type { CityBase } from '@/entities/admin-old/city/types/base.model'

export interface CityCreateRequest extends CityBase {
  countryId: number
}

export type CityUpdateRequest = Partial<CityCreateRequest>
