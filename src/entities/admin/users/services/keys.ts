const baseKey = ["adminUser"] as const

export const userQueryKeys = {
  list: (page: number, perPage: number) =>
    [...baseKey, { page, perPage }] as const,
  detail: (id: string) => [...baseKey, id] as const,
  lookups: () => [...baseKey, "lookup"] as const,
}
