export const genderTypes = ["male", "female", "other"] as const

export type Gender = (typeof genderTypes)[number]
