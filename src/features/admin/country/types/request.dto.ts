import type { CountryBase } from "./base.model"

export interface CountryCreateRequest extends CountryBase {}

export interface CountryUpdateRequest extends Partial<CountryBase> {}
