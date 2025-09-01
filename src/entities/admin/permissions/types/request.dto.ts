import type { PermissionBase } from '@/entities/admin/permissions/types/base.model'

export interface PermissionCreateRequest extends PermissionBase {
  departmentId: string
}

export type PermissionUpdateRequest = Partial<PermissionCreateRequest>
