const baseKey = ['adminOrganization'] as const

export const organizationQueryKeys = {
  list: (page: number, perPage: number) => [...baseKey, { page, perPage }] as const,
  detail: (id: string) => [...baseKey, id] as const,
  lookups: () => [...baseKey, 'lookup'] as const,
  lookupsNew: (params: { page: number; search: string }) => [...baseKey, 'lookup', params] as const,
  lookupByIds: (ids: string[]) => [...baseKey, 'lookup', 'by-ids', ...ids.sort()] as const,
}
