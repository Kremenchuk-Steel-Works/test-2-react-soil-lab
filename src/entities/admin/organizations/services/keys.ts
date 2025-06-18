const baseKey = ["adminOrganization"] as const

export const organizationQueryKeys = {
  list: (page: number, perPage: number) =>
    [...baseKey, { page, perPage }] as const,
  detail: (id: string) => [...baseKey, id] as const,
  lookups: () => [...baseKey, "lookup"] as const,
}
