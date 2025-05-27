export const addressTypes = [
  "billing",
  "shipping",
  "warehouse",
  "plant",
  "office",
  "home",
] as const

export type AddressType = (typeof addressTypes)[number]
