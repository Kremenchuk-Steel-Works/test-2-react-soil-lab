import type { DepartmentBase } from '@/entities/admin-old/departments/types/base.model'

export type DepartmentCreateRequest = DepartmentBase
export type DepartmentUpdateRequest = Partial<DepartmentCreateRequest>
