import type { PermissionDetailResponse } from '@/entities/admin/permissions/types/response.dto'

export const mockPermissions: PermissionDetailResponse[] = [
  {
    id: 1,
    name: "Перегляд звітів",
    description: "Дозвіл на перегляд фінансових звітів",
    department: {
      id: "dep-001",
      name: "Фінансовий відділ",
      description: "Відповідає за фінансову звітність",
    },
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-02-10T12:30:00Z",
  },
  {
    id: 2,
    name: "Редагування користувачів",
    description: "Дозвіл на редагування інформації користувачів",
    department: {
      id: "dep-002",
      name: "Відділ кадрів",
      description: "Керує персоналом компанії",
    },
    createdAt: "2025-01-20T09:15:00Z",
    updatedAt: "2025-02-18T14:45:00Z",
  },
  {
    id: 3,
    name: "Доступ до аналітики",
    description: "Дозвіл на перегляд аналітичних панелей",
    department: {
      id: "dep-003",
      name: "Аналітичний відділ",
      description: "Аналізує дані компанії",
    },
    createdAt: "2025-03-01T08:00:00Z",
    updatedAt: "2025-03-15T16:20:00Z",
  },
  {
    id: 4,
    name: "Створення проєктів",
    description: "Дозвіл на створення нових проєктів",
    department: {
      id: "dep-004",
      name: "Відділ розробки",
      description: "Відповідає за технічну реалізацію",
    },
    createdAt: "2025-02-01T11:00:00Z",
    updatedAt: "2025-02-25T13:30:00Z",
  },
  {
    id: 5,
    name: "Управління задачами",
    description: "Дозвіл на призначення та зміну задач",
    department: {
      id: "dep-004",
      name: "Відділ розробки",
    },
    createdAt: "2025-01-28T14:00:00Z",
    updatedAt: "2025-03-02T09:45:00Z",
  },
  {
    id: 6,
    name: "Перегляд профілів",
    description: "Дозвіл на перегляд профілів співробітників",
    department: {
      id: "dep-002",
      name: "Відділ кадрів",
    },
    createdAt: "2025-01-10T10:10:00Z",
    updatedAt: "2025-01-15T10:15:00Z",
  },
  {
    id: 7,
    name: "Управління бюджетом",
    description: "Дозвіл на зміну бюджету підрозділів",
    department: {
      id: "dep-001",
      name: "Фінансовий відділ",
    },
    createdAt: "2025-03-05T11:11:00Z",
    updatedAt: "2025-03-10T12:12:00Z",
  },
  {
    id: 8,
    name: "Затвердження відпусток",
    description: "Дозвіл на затвердження заявок на відпустку",
    department: {
      id: "dep-002",
      name: "Відділ кадрів",
    },
    createdAt: "2025-01-05T08:30:00Z",
    updatedAt: "2025-02-01T09:00:00Z",
  },
  {
    id: 9,
    name: "Керування доступами",
    description: "Дозвіл на надання та відкликання доступів",
    department: {
      id: "dep-005",
      name: "Відділ безпеки",
      description: "Забезпечує ІТ-безпеку",
    },
    createdAt: "2025-02-20T13:00:00Z",
    updatedAt: "2025-02-25T14:00:00Z",
  },
  {
    id: 10,
    name: "Перегляд документації",
    description: "Дозвіл на перегляд внутрішньої документації",
    department: {
      id: "dep-006",
      name: "Відділ документації",
      description: "Відповідає за технічну документацію",
    },
    createdAt: "2025-01-01T09:00:00Z",
    updatedAt: "2025-01-10T09:30:00Z",
  },
]
