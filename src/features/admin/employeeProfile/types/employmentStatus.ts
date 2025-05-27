export const employmentStatuses = [
  "intern",
  "full-time",
  "part-time",
  "contract",
  "on-leave",
  "suspended",
  "terminated",
  "retired",
] as const

export type EmploymentStatus = (typeof employmentStatuses)[number]
