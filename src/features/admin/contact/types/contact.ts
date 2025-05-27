export const contactTypes = [
  "email",
  "phone",
  "telegram",
  "linkedin",
  "website",
] as const

export type ContactType = (typeof contactTypes)[number]
