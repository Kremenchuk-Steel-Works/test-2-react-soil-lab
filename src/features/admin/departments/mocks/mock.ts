import type { DepartmentResponse } from "../types/response.dto"

export const mockDepartments: DepartmentResponse[] = [
  {
    id: "a1d2e3f4-1111-4444-aaaa-123456789abc",
    name: "Finance",
    description: "Handles company budgeting and financial reporting",
    createdAt: "2023-01-10T08:30:00Z",
    updatedAt: "2023-03-15T12:45:00Z",
    permissions: [
      { id: 1, name: "View Budget", departmentName: "Finance" },
      { id: 2, name: "Edit Invoices", departmentName: "Finance" },
    ],
  },
  {
    id: "b2e3f4a5-2222-5555-bbbb-23456789abcd",
    name: "Production",
    description: "Oversees product manufacturing",
    createdAt: "2023-02-12T09:00:00Z",
    updatedAt: "2023-04-18T14:10:00Z",
    permissions: [
      { id: 3, name: "Manage Line", departmentName: "Production" },
      { id: 4, name: "Access Equipment Logs", departmentName: "Production" },
    ],
  },
  {
    id: "c3f4a5b6-3333-6666-cccc-3456789abcde",
    name: "Sales",
    description: "Handles client relations and product sales",
    createdAt: "2023-03-15T10:20:00Z",
    updatedAt: "2023-05-20T16:30:00Z",
    permissions: [{ id: 5, name: "View Leads", departmentName: "Sales" }],
  },
  {
    id: "d4a5b6c7-4444-7777-dddd-456789abcdef",
    name: "Logistics",
    description: "Manages transportation and storage",
    createdAt: "2023-04-01T11:15:00Z",
    updatedAt: "2023-06-01T17:20:00Z",
    permissions: [
      { id: 6, name: "Track Shipments", departmentName: "Logistics" },
      { id: 7, name: "Edit Routes", departmentName: "Logistics" },
    ],
  },
  {
    id: "e5b6c7d8-5555-8888-eeee-56789abcdef0",
    name: "Maintenance",
    description: "Maintains facilities and equipment",
    createdAt: "2023-05-08T13:00:00Z",
    updatedAt: "2023-07-02T18:30:00Z",
    permissions: [
      { id: 8, name: "Request Repairs", departmentName: "Maintenance" },
    ],
  },
  {
    id: "f6c7d8e9-6666-9999-ffff-6789abcdef01",
    name: "Engineering",
    description: "Develops technical solutions",
    createdAt: "2023-06-10T12:00:00Z",
    updatedAt: "2023-08-05T19:15:00Z",
    permissions: [
      { id: 9, name: "Deploy Systems", departmentName: "Engineering" },
      { id: 10, name: "Run Diagnostics", departmentName: "Engineering" },
    ],
  },
  {
    id: "g7d8e9f0-7777-0000-aaaa-789abcdef012",
    name: "HR",
    description: "Handles hiring and employee relations",
    createdAt: "2023-07-15T10:00:00Z",
    updatedAt: "2023-09-01T11:45:00Z",
    permissions: [
      { id: 11, name: "Access Employee Records", departmentName: "HR" },
    ],
  },
  {
    id: "h8e9f0g1-8888-1111-bbbb-89abcdef0123",
    name: "Education",
    description: "Provides internal training",
    createdAt: "2023-08-20T09:40:00Z",
    updatedAt: "2023-10-05T13:25:00Z",
    permissions: [
      { id: 12, name: "Assign Training", departmentName: "Education" },
    ],
  },
  {
    id: "i9f0g1h2-9999-2222-cccc-9abcdef01234",
    name: "Healthcare",
    description: "Manages medical support",
    createdAt: "2023-09-30T14:10:00Z",
    updatedAt: "2023-11-10T15:30:00Z",
    permissions: [
      { id: 13, name: "Access Health Records", departmentName: "Healthcare" },
    ],
  },
  {
    id: "j0g1h2i3-0000-3333-dddd-0abcdef12345",
    name: "Security",
    description: "Ensures safety and compliance",
    createdAt: "2023-10-25T07:30:00Z",
    updatedAt: "2023-12-15T08:45:00Z",
    permissions: [
      { id: 14, name: "Monitor Cameras", departmentName: "Security" },
      { id: 15, name: "Manage Access Cards", departmentName: "Security" },
    ],
  },
]
