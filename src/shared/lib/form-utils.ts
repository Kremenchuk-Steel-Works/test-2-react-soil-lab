// Для множественной операции
export type Operation<T> =
  | { action: 'create'; data: Omit<T, 'id'> }
  | { action: 'update'; id: string | number; data: Omit<T, 'id'> }
  | { action: 'delete'; id: string | number }

/**
 * Сравнивает два массива объектов (оригинальный и текущий) и генерирует
 * список операций (create, update, delete) для отправки на API.
 * @param originalItems - Исходный массив с сервера.
 * @param currentItems - Массив из формы после изменений.
 * @returns Массив операций.
 */
export function createArrayOperations<T extends { id?: string | number }>(
  originalItems: T[] = [],
  currentItems: T[] = [],
): Operation<T>[] {
  const operations: Operation<T>[] = []
  const originalMap = new Map(originalItems.map((item) => [item.id, item]))
  const currentMap = new Map(currentItems.filter((item) => item.id).map((item) => [item.id!, item]))

  // DELETE
  for (const originalItem of originalItems) {
    if (originalItem.id && !currentMap.has(originalItem.id)) {
      operations.push({ action: 'delete', id: originalItem.id })
    }
  }

  // CREATE || UPDATE
  for (const currentItem of currentItems) {
    if (!currentItem.id) {
      // Если ID нет, это всегда создание
      const { id, ...data } = currentItem
      void id
      operations.push({ action: 'create', data })
    } else {
      // Если ID есть, это обновление
      if (originalMap.has(currentItem.id)) {
        const { id, ...data } = currentItem
        void id
        operations.push({ action: 'update', id: currentItem.id, data })
      }
    }
  }

  return operations
}

// Для одиночной операции
export type SingleOperation<T> =
  | { action: 'create'; data: T }
  | { action: 'update'; data: T }
  | { action: 'delete' }

/**
 * Сравнивает два состояния объекта (оригинальное и текущее) и определяет,
 * какую операцию (create, update, delete) необходимо выполнить.
 * @param originalItem - Исходный объект с сервера (может быть undefined).
 * @param currentItem - Текущий объект из формы (может быть undefined).
 * @returns Объект операции или undefined, если изменений не было.
 */
export function createSingleObjectOperation<T>(
  originalItem: T | undefined,
  currentItem: T | undefined,
): SingleOperation<T> | undefined {
  const hasOriginal = originalItem !== null && originalItem !== undefined
  const hasCurrent = currentItem !== null && currentItem !== undefined

  if (hasCurrent && !hasOriginal) {
    return { action: 'create', data: currentItem }
  }

  if (hasCurrent && hasOriginal) {
    return { action: 'update', data: currentItem }
  }

  if (!hasCurrent && hasOriginal) {
    return { action: 'delete' }
  }

  return undefined
}
