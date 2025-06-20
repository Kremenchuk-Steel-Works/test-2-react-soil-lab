import type { CityBase } from '@/entities/admin/city/types/base.model'

export interface CityCreateRequest extends CityBase {
  countryId: number
}

export interface CityUpdateRequest extends Partial<CityCreateRequest> {}
