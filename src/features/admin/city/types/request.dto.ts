import type { CityBase } from "./base.model"

export interface CityCreateRequest extends CityBase {
  countryId: number
}

export interface CityUpdateRequest extends Partial<CityCreateRequest> {}
