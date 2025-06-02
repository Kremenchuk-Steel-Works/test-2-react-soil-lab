export const employeeProfileOptions = [
  { value: "intern", label: "Стажер" },
  { value: "full-time", label: "Повна зайнятість" },
  { value: "part-time", label: "Неповна зайнятість" },
  { value: "contract", label: "Контракт" },
  { value: "on-leave", label: "У відпустці" },
  { value: "suspended", label: "Призупинено" },
  { value: "terminated", label: "Звільнений" },
  { value: "retired", label: "На пенсії" },
] as const

export type EmploymentStatus = (typeof employeeProfileOptions)[number]["value"]
