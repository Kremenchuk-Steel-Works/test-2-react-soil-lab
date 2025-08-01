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

/**
 * Утилита для извлечения типа одного элемента из любого PaginatedListResponse.
 * @example
 * type UserRow = ListDataType<UserListResponse>; // Результат: UserListItemResponse
 */
export type ListDataType<T extends PaginatedListResponse<unknown>> = T['data'][number]
