import type { Option } from '@/shared/ui/select/ReactSelect'

export const genderOptions: Option<string>[] = [
  { value: "male", label: "Чоловіча" },
  { value: "female", label: "Жіноча" },
  { value: "other", label: "Інша" },
] as const

export type Gender = (typeof genderOptions)[number]["value"]
