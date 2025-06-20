import type { PositionDetailResponse } from '@/entities/admin/positions/types/response.dto'

export const mockPositions: PositionDetailResponse[] = [
  {
    id: "pos-001",
    name: "Менеджер проєктів",
    description: "Керує проєктами та координує команду",
    createdAt: "2025-01-10T09:00:00Z",
    updatedAt: "2025-04-15T11:30:00Z",
  },
  {
    id: "pos-002",
    name: "Розробник програмного забезпечення",
    description: "Пише та підтримує код продуктів компанії",
    createdAt: "2025-01-12T10:15:00Z",
    updatedAt: "2025-04-12T14:20:00Z",
  },
  {
    id: "pos-003",
    name: "Аналітик даних",
    description: "Збирає та аналізує бізнес-дані",
    createdAt: "2025-02-01T08:45:00Z",
    updatedAt: "2025-04-10T09:50:00Z",
  },
  {
    id: "pos-004",
    name: "Фінансовий аналітик",
    description: "Відповідає за фінансове планування та звітність",
    createdAt: "2025-01-20T13:00:00Z",
    updatedAt: "2025-03-30T15:10:00Z",
  },
  {
    id: "pos-005",
    name: "Тестувальник",
    description: "Проводить тестування програмного забезпечення",
    createdAt: "2025-03-01T09:30:00Z",
    updatedAt: "2025-04-05T10:00:00Z",
  },
  {
    id: "pos-006",
    name: "Адміністратор систем",
    description: "Підтримує роботу серверів та мережі",
    createdAt: "2025-02-15T11:45:00Z",
    updatedAt: "2025-04-13T12:15:00Z",
  },
  {
    id: "pos-007",
    name: "HR-менеджер",
    description: "Керує персоналом та процесом рекрутингу",
    createdAt: "2025-01-25T14:20:00Z",
    updatedAt: "2025-03-25T16:30:00Z",
  },
  {
    id: "pos-008",
    name: "Маркетолог",
    description: "Розробляє маркетингові стратегії та кампанії",
    createdAt: "2025-02-10T10:00:00Z",
    updatedAt: "2025-04-01T13:40:00Z",
  },
  {
    id: "pos-009",
    name: "Дизайнер",
    description: "Створює візуальні концепції та макети",
    createdAt: "2025-03-05T09:15:00Z",
    updatedAt: "2025-04-10T11:05:00Z",
  },
  {
    id: "pos-010",
    name: "Технічний письменник",
    description: "Готує технічну документацію для продуктів",
    createdAt: "2025-02-28T08:50:00Z",
    updatedAt: "2025-03-28T10:25:00Z",
  },
]
