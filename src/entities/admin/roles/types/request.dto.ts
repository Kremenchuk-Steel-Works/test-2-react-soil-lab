import type { RoleBase } from '@/entities/admin/roles/types/base.model'

export interface RoleCreateRequest extends RoleBase {
  permissionIds?: number[]
}

export type RoleUpdateRequest = Partial<RoleCreateRequest>
