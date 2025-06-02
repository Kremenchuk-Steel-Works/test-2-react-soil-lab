export const addressOptions = [
  { value: "billing", label: "Виставлення рахунків" },
  { value: "shipping", label: "Доставка" },
  { value: "warehouse", label: "Склад" },
  { value: "plant", label: "Завод" },
  { value: "office", label: "Офіс" },
  { value: "home", label: "Домашня адреса" },
] as const

export type Address = (typeof addressOptions)[number]["value"]
