export interface CityCreateRequest {
  name: string
  nameLocal: string
  countryId: number
}

export interface CityUpdateRequest {
  code?: string | null
  code3?: string | null
  numericCode?: string | null
  name?: string | null
  nameLocal?: string | null
}
