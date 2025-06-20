import type { CountryBase } from '@/entities/admin/country/types/base.model'

export interface CountryCreateRequest extends CountryBase {}

export interface CountryUpdateRequest extends Partial<CountryBase> {}
