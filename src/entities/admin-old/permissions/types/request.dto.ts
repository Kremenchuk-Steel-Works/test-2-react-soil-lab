import type { PermissionBase } from '@/entities/admin-old/permissions/types/base.model'

export interface PermissionCreateRequest extends PermissionBase {
  departmentId: string
}

export type PermissionUpdateRequest = Partial<PermissionCreateRequest>
