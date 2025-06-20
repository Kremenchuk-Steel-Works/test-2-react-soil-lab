import type { RoleDetailResponse } from '@/entities/admin/roles/types/response.dto'

export const mockRoles: RoleDetailResponse[] = [
  {
    id: 1,
    name: 'Адміністратор',
    description: 'Повний доступ до системи',
    permissions: [
      {
        id: 1,
        name: 'Керування користувачами',
        departmentName: 'Відділ кадрів',
      },
      {
        id: 2,
        name: 'Управління бюджетом',
        departmentName: 'Фінансовий відділ',
      },
      { id: 3, name: 'Доступ до звітів', departmentName: 'Аналітичний відділ' },
    ],
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-05-10T12:00:00Z',
  },
  {
    id: 2,
    name: 'Менеджер проектів',
    description: 'Управління проєктами і командами',
    permissions: [
      { id: 4, name: 'Створення проєктів', departmentName: 'Відділ розробки' },
      { id: 5, name: 'Призначення задач', departmentName: 'Відділ розробки' },
    ],
    createdAt: '2025-02-01T09:30:00Z',
    updatedAt: '2025-04-25T11:15:00Z',
  },
  {
    id: 3,
    name: 'Фінансовий аналітик',
    description: 'Перегляд фінансових звітів та аналітики',
    permissions: [
      { id: 6, name: 'Перегляд звітів', departmentName: 'Фінансовий відділ' },
      { id: 7, name: 'Аналіз бюджету', departmentName: 'Фінансовий відділ' },
    ],
    createdAt: '2025-01-15T10:45:00Z',
    updatedAt: '2025-05-01T14:00:00Z',
  },
  {
    id: 4,
    name: 'HR-спеціаліст',
    description: 'Управління персоналом і кадровими процесами',
    permissions: [
      {
        id: 8,
        name: 'Редагування користувачів',
        departmentName: 'Відділ кадрів',
      },
      {
        id: 9,
        name: 'Затвердження відпусток',
        departmentName: 'Відділ кадрів',
      },
    ],
    createdAt: '2025-02-10T08:20:00Z',
    updatedAt: '2025-04-20T09:50:00Z',
  },
  {
    id: 5,
    name: 'Аналітик даних',
    description: 'Аналіз бізнес-даних та створення звітів',
    permissions: [
      {
        id: 10,
        name: 'Доступ до аналітики',
        departmentName: 'Аналітичний відділ',
      },
      { id: 3, name: 'Доступ до звітів', departmentName: 'Аналітичний відділ' },
    ],
    createdAt: '2025-03-05T07:40:00Z',
    updatedAt: '2025-04-28T10:10:00Z',
  },
  {
    id: 6,
    name: 'Розробник',
    description: 'Розробка та підтримка ПЗ',
    permissions: [
      {
        id: 11,
        name: 'Доступ до репозиторію',
        departmentName: 'Відділ розробки',
      },
      { id: 5, name: 'Призначення задач', departmentName: 'Відділ розробки' },
    ],
    createdAt: '2025-01-22T09:15:00Z',
    updatedAt: '2025-05-02T11:45:00Z',
  },
  {
    id: 7,
    name: 'Тестувальник',
    description: 'Тестування ПЗ та звіти про баги',
    permissions: [
      {
        id: 12,
        name: 'Проведення тестування',
        departmentName: 'Відділ розробки',
      },
    ],
    createdAt: '2025-02-28T10:00:00Z',
    updatedAt: '2025-04-15T12:20:00Z',
  },
  {
    id: 8,
    name: 'Маркетолог',
    description: 'Розробка маркетингових стратегій',
    permissions: [{ id: 13, name: 'Кампанії', departmentName: 'Маркетинговий відділ' }],
    createdAt: '2025-01-30T08:50:00Z',
    updatedAt: '2025-04-30T09:55:00Z',
  },
  {
    id: 9,
    name: 'Адміністратор систем',
    description: 'Адміністрування серверів та мережі',
    permissions: [
      { id: 14, name: 'Управління серверами', departmentName: 'ІТ-відділ' },
      { id: 15, name: 'Налаштування мережі', departmentName: 'ІТ-відділ' },
    ],
    createdAt: '2025-01-18T07:30:00Z',
    updatedAt: '2025-05-05T10:00:00Z',
  },
  {
    id: 10,
    name: 'Користувач',
    description: 'Обмежений доступ для звичайних користувачів',
    permissions: [
      {
        id: 16,
        name: 'Перегляд документації',
        departmentName: 'Відділ документації',
      },
    ],
    createdAt: '2025-03-10T09:25:00Z',
    updatedAt: '2025-04-18T11:40:00Z',
  },
]
