import type { Timestamps } from "../../../../types/common"
import type { PaginatedListResponse } from "../../../../types/pagination"
import type { PermissionListItemResponse } from "../../permissions/types/response.dto"
import type { RoleBase } from "./base.model"

export interface RoleResponse extends RoleBase {
  id: number
}

export interface RoleLookupResponse {
  id: number
  name: string
}

export interface RoleDetailResponse extends RoleResponse, Timestamps {
  permissions: PermissionListItemResponse[]
}

export interface RoleShortResponse {
  id: number
  name: string
  permissions: PermissionListItemResponse[]
}

export type RoleListResponse = PaginatedListResponse<RoleShortResponse>
