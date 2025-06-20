import type { DepartmentBase } from '@/entities/admin/departments/types/base.model'

export interface DepartmentCreateRequest extends DepartmentBase {}

export interface DepartmentUpdateRequest extends Partial<DepartmentCreateRequest> {}
