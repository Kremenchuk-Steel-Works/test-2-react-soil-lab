import type { DepartmentDetailResponse } from "../types/response.dto"

export const mockDepartments: DepartmentDetailResponse[] = [
  {
    id: "1",
    name: "HR",
    description: "Відділ кадрів",
    createdAt: "2023-01-01T09:00:00Z",
    updatedAt: "2024-01-01T09:00:00Z",
    permissions: [
      { name: "view_employees", description: "Перегляд списку співробітників" },
      {
        name: "edit_employees",
        description: "Редагування даних співробітників",
      },
    ],
  },
  {
    id: "2",
    name: "IT",
    description: "Інформаційні технології",
    createdAt: "2023-02-01T10:00:00Z",
    updatedAt: "2024-02-01T10:00:00Z",
    permissions: [
      { name: "manage_systems", description: "Керування ІТ-системами" },
      { name: "access_logs", description: "Доступ до логів" },
    ],
  },
  {
    id: "3",
    name: "Finance",
    description: "Фінансовий відділ",
    createdAt: "2023-03-01T11:00:00Z",
    updatedAt: "2024-03-01T11:00:00Z",
    permissions: [
      { name: "view_budget", description: "Перегляд бюджету" },
      { name: "approve_expenses", description: "Затвердження витрат" },
    ],
  },
  {
    id: "4",
    name: "Legal",
    description: "Юридичний відділ",
    createdAt: "2023-04-01T12:00:00Z",
    updatedAt: "2024-04-01T12:00:00Z",
    permissions: [
      { name: "review_contracts", description: "Розгляд контрактів" },
      { name: "manage_risks", description: "Управління ризиками" },
    ],
  },
  {
    id: "5",
    name: "Marketing",
    description: "Маркетинг",
    createdAt: "2023-05-01T13:00:00Z",
    updatedAt: "2024-05-01T13:00:00Z",
    permissions: [
      { name: "create_campaigns", description: "Створення кампаній" },
      { name: "view_analytics", description: "Перегляд аналітики" },
    ],
  },
  {
    id: "6",
    name: "Sales",
    description: "Відділ продажу",
    createdAt: "2023-06-01T14:00:00Z",
    updatedAt: "2024-06-01T14:00:00Z",
    permissions: [
      { name: "access_clients", description: "Доступ до клієнтів" },
      { name: "manage_deals", description: "Управління угодами" },
    ],
  },
  {
    id: "7",
    name: "Support",
    description: "Підтримка",
    createdAt: "2023-07-01T15:00:00Z",
    updatedAt: "2024-07-01T15:00:00Z",
    permissions: [
      { name: "handle_tickets", description: "Обробка заявок" },
      { name: "respond_customers", description: "Відповіді клієнтам" },
    ],
  },
  {
    id: "8",
    name: "Operations",
    description: "Операційний відділ",
    createdAt: "2023-08-01T16:00:00Z",
    updatedAt: "2024-08-01T16:00:00Z",
    permissions: [
      { name: "monitor_processes", description: "Моніторинг процесів" },
      { name: "optimize_flows", description: "Оптимізація потоків" },
    ],
  },
  {
    id: "9",
    name: "R&D",
    description: "Науково-дослідний відділ",
    createdAt: "2023-09-01T17:00:00Z",
    updatedAt: "2024-09-01T17:00:00Z",
    permissions: [
      { name: "conduct_research", description: "Проведення досліджень" },
      { name: "file_patents", description: "Оформлення патентів" },
    ],
  },
  {
    id: "10",
    name: "Security",
    description: "Відділ безпеки",
    createdAt: "2023-10-01T18:00:00Z",
    updatedAt: "2024-10-01T18:00:00Z",
    permissions: [
      { name: "monitor_surveillance", description: "Моніторинг спостереження" },
      { name: "respond_incidents", description: "Реакція на інциденти" },
    ],
  },
]
