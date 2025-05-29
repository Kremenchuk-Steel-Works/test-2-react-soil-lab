import type { Timestamps } from "../../../../types/common"
import type { PaginatedListResponse } from "../../../../types/pagination"
import type { PermissionShortResponse } from "../../permissions/types/response.dto"
import type { DepartmentBase } from "./base.model"

export interface DepartmentResponse extends DepartmentBase {
  id: string
}

export interface DepartmentDetailResponse
  extends DepartmentResponse,
    Timestamps {
  permissions: PermissionShortResponse[]
}

export interface DepartmentShortResponse extends DepartmentResponse {}

export type DepartmentListResponse =
  PaginatedListResponse<DepartmentShortResponse>
