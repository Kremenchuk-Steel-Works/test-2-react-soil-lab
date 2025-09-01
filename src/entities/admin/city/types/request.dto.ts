import type { CityBase } from '@/entities/admin/city/types/base.model'

export interface CityCreateRequest extends CityBase {
  countryId: number
}

export type CityUpdateRequest = Partial<CityCreateRequest>
