export interface PageParams {
  page?: number
  perPage?: number
}

export type PaginatedListResponse<TDataKey extends string, TItem> = {
  [key in TDataKey]: TItem[]
} & {
  page: number
  totalPages: number
  totalItems: number
}
