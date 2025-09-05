const baseKey = ['adminPosition'] as const

export const positionQueryKeys = {
  list: (page: number, perPage: number) => [...baseKey, { page, perPage }] as const,
  detail: (id: string) => [...baseKey, id] as const,
  lookups: () => [...baseKey, 'lookup'] as const,
}
