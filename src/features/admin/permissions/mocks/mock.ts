import type { Permission } from "../types"

export const mockPermissions: Permission[] = [
  {
    id: "p001aa11-9c21-4f6d-8f23-7ae1d8e3f110",
    name: "view_financial_reports",
    description: "Can view financial reports",
    departmentId: "101a9c1b-35d8-4e1d-9b6d-56789ab01a1c",
  },
  {
    id: "p002bb22-5d32-42ab-baf2-7ec1d9c3a201",
    name: "edit_budget",
    description: "Can edit department budget",
    departmentId: "101a9c1b-35d8-4e1d-9b6d-56789ab01a1c",
  },
  {
    id: "p003cc33-7c43-4b0f-bc03-47a1ac6fcd2a",
    name: "manage_production_schedule",
    description: "Can manage and update production schedules",
    departmentId: "202b3e4c-78a4-45ff-ae01-23f112b56cde",
  },
  {
    id: "p004dd44-8d54-4c1d-bd14-56b2dc7afd3b",
    name: "view_sales_data",
    description: "Can view sales metrics and analytics",
    departmentId: "303c7a2f-1f2e-4f61-82fc-99abc453a12e",
  },
  {
    id: "p005ee55-9e65-4d2e-be25-65c3ed8bde4c",
    name: "edit_logistics_routes",
    description: "Can create and edit logistics routes",
    departmentId: "404d6e2b-55af-437f-9cce-12ecf123f7d1",
  },
  {
    id: "p006ff66-1f76-4e3f-af36-74d4fe9cdf5d",
    name: "schedule_maintenance",
    description: "Can schedule machinery maintenance",
    departmentId: "505e2c1d-89ef-4f6b-8b71-234db556bcef",
  },
  {
    id: "p007gg77-2a87-4f4e-bf47-83e5af0def6e",
    name: "access_engineering_docs",
    description: "Can access technical engineering documents",
    departmentId: "606f8d3e-2b3a-4f13-bb5d-ae11c58df089",
  },
  {
    id: "p008hh88-3b98-4f5f-cf58-92f6bf1eef7f",
    name: "manage_employees",
    description: "Can manage employee records",
    departmentId: "707a1b2d-1c4d-47ab-9d8f-0be21dce134f",
  },
  {
    id: "p009ii99-4c09-4f6f-df69-a1e7cf2ff090",
    name: "assign_training",
    description: "Can assign and schedule training modules",
    departmentId: "808b9e3f-5c6f-43b8-91f0-67ac123fd09e",
  },
  {
    id: "p010jj00-5d10-4f70-ef70-b2f8df3ff1a1",
    name: "monitor_security_cameras",
    description: "Can view live and recorded security camera footage",
    departmentId: "010d5e6a-3f4a-4b7c-823f-abc98f452eb3",
  },
]
