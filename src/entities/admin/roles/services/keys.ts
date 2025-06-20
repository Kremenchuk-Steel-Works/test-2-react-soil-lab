const baseKey = ['adminRole'] as const

export const roleQueryKeys = {
  list: (page: number, perPage: number) => [...baseKey, { page, perPage }] as const,
  detail: (id: string) => [...baseKey, id] as const,
  lookups: () => [...baseKey, 'lookup'] as const,
}
