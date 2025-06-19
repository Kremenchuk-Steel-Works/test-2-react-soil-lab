import type { Option } from "../../../../shared/ui/select/ReactSelect"

export const addressOptions: Option<string>[] = [
  { value: "billing", label: "Виставлення рахунків" },
  { value: "shipping", label: "Доставка" },
  { value: "warehouse", label: "Склад" },
  { value: "plant", label: "Завод" },
  { value: "office", label: "Офіс" },
  { value: "home", label: "Домашня адреса" },
] as const

export type Address = (typeof addressOptions)[number]["value"]
