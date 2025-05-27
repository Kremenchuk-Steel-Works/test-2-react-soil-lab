export interface CountryCreateRequest {
  code: string
  code3: string | null
  numericCode: string | null
  name: string
  nameLocal: string
}

export interface CountryUpdateRequest {
  code?: string | null
  code3?: string | null
  numericCode?: string | null
  name?: string | null
  nameLocal?: string | null
}
