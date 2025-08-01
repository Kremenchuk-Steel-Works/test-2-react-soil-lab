export interface Timestamps {
  createdAt: string
  updatedAt: string
}

export interface SoftArchiveStatusMixin {
  archivedAt: string
}

export interface SoftDeleteStatusMixin {
  deletedAt: string
}

/** Базовая операция для создания сущности типа T */
export interface CreateOperationBase<T> {
  action: 'create'
  data: T
}

/** Базовая операция для обновления сущности типа T */
export interface UpdateOperationBase<T> {
  action: 'update'
  id: string
  data: T
}

/** Базовая операция для удаления */
export interface DeleteOperationBase {
  action: 'delete'
  id: string
}
