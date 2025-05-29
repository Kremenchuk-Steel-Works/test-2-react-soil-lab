export interface PageParams {
  page?: number
  perPage?: number
}

export type PaginatedListResponse<TItem> = {
  data: TItem[]
  page: number
  totalPages: number
  totalItems: number
}
