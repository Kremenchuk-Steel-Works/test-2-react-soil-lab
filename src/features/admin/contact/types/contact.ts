export const contactOptions = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Телефон" },
  { value: "telegram", label: "Телеграм" },
  { value: "linkedin", label: "Linkedin" },
  { value: "website", label: "Вебсайт" },
] as const

export type Contact = (typeof contactOptions)[number]["value"]
