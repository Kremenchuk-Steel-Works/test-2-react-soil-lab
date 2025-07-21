const baseKey = ['adminPerson'] as const

export const personQueryKeys = {
  list: (page: number, perPage: number) => [...baseKey, { page, perPage }] as const,
  detail: (id: string) => [...baseKey, id] as const,
  lookups: () => [...baseKey, 'lookup'] as const,
  uniqueness: (field: string, value: string) => [...baseKey, 'uniqueness', field, value] as const,
}
