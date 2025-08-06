import equal from 'fast-deep-equal'

/**
 * Вспомогательная функция для нахождения разницы между двумя объектами.
 * Возвращает объект, содержащий только те поля, которые были изменены.
 * @param original Исходный объект
 * @param current Текущий объект
 * @returns Объект с измененными полями (Partial<T>)
 */
function getObjectDiff<T extends Record<string, any>>(original: T, current: T): Partial<T> {
  const diff: Partial<T> = {}
  // Проверяем все ключи в новом объекте на предмет изменений
  for (const key in current) {
    if (Object.prototype.hasOwnProperty.call(current, key) && !equal(original[key], current[key])) {
      diff[key] = current[key]
    }
  }
  return diff
}

// --- ДЛЯ МАССИВОВ (ONE-TO-MANY) ---

export type ApiArrayOperation<T> =
  | { action: 'create'; data: Omit<T, 'id'> }
  // data теперь Partial, так как мы шлём только дельту изменений
  | { action: 'update'; id: string | number; data: Partial<Omit<T, 'id'>> }
  | { action: 'delete'; id: string | number }

export function createApiArrayOperations<T extends { id: string | number }>(
  originalItems: T[] | null | undefined,
  currentItems: T[] | null | undefined,
): ApiArrayOperation<T>[] {
  const operations: ApiArrayOperation<T>[] = []
  const safeOriginals = originalItems ?? []
  const safeCurrents = currentItems ?? []

  const originalMap = new Map(safeOriginals.map((item) => [item.id, item]))
  const currentIds = new Set(safeCurrents.map((item) => item.id))

  // DELETE
  for (const originalItem of safeOriginals) {
    if (originalItem.id && !currentIds.has(originalItem.id)) {
      operations.push({ action: 'delete', id: originalItem.id })
    }
  }

  // CREATE / UPDATE
  for (const currentItem of safeCurrents) {
    const { id } = currentItem

    if (!id) {
      const { id: _, ...data } = currentItem
      operations.push({ action: 'create', data })
    } else {
      const originalItem = originalMap.get(id)
      if (originalItem) {
        // Вычисляем дельту (разницу)
        const diff = getObjectDiff(originalItem, currentItem)
        // Отправляем update только если есть реальные изменения
        if (Object.keys(diff).length > 0) {
          const { id: _id, ...updatePayload } = diff // Убираем id из данных
          operations.push({ action: 'update', id, data: updatePayload })
        }
      }
    }
  }
  return operations
}

// --- ДЛЯ ОДИНОЧНЫХ ОБЪЕКТОВ (ONE-TO-ONE) ---

export type ApiSingleOperation<T> =
  | { create: T; update?: never; delete?: never }
  | { update: Partial<T>; create?: never; delete?: never }
  | { delete: true; create?: never; update?: never }

export function createApiSingleOperation<T extends object>(
  originalItem: T | null | undefined,
  currentItem: T | null | undefined,
): ApiSingleOperation<T> | undefined {
  const hasOriginal = originalItem != null
  const hasCurrent = currentItem != null

  if (hasCurrent && !hasOriginal) {
    return { create: currentItem! }
  }

  if (hasCurrent && hasOriginal) {
    // Вычисляем дельту
    const diff = getObjectDiff(originalItem!, currentItem!)
    // Если есть изменения, возвращаем операцию с дельтой
    if (Object.keys(diff).length > 0) {
      return { update: diff }
    }
  }

  if (!hasCurrent && hasOriginal) {
    return { delete: true }
  }

  return undefined
}

/**
 * Определяем базовый тип для операции, чтобы соответствовать API.
 * Используем дженерики для гибкости.
 */
export type ApiObjectOperation<T, ID = string | number> =
  | { action: 'create'; data: Omit<T, 'id'> }
  | { action: 'update'; id: ID; data: Partial<Omit<T, 'id'>> }
  | { action: 'delete'; id: ID }

/**
 * Создает операцию (create, update, delete) для одиночного вложенного объекта.
 * @param originalItem - Исходный объект изначальных данных (с сервера).
 * @param currentItem - Текущий объект из данных формы.
 * @returns Объект операции или `null`, если изменений не было.
 */
export function createApiObjectOperation<T extends { id: string | number }>(
  originalItem: T | null | undefined,
  currentItem: T | null | undefined,
): ApiObjectOperation<T> | null {
  const hasOriginal = originalItem != null && originalItem.id
  const hasCurrent = currentItem != null

  // CREATE: Раньше объекта не было, а теперь есть.
  if (hasCurrent && !hasOriginal) {
    const { id: _, ...data } = currentItem // Убираем временный/пустой id
    return { action: 'create', data }
  }

  // DELETE: Раньше объект был, а теперь его нет.
  if (!hasCurrent && hasOriginal) {
    return { action: 'delete', id: originalItem.id }
  }

  // UPDATE: Объект был и остался, проверяем изменения.
  if (hasCurrent && hasOriginal) {
    const diff = getObjectDiff(originalItem, currentItem)

    // Отправляем update только если есть реальные изменения.
    if (Object.keys(diff).length > 0) {
      const { id: _id, ...updatePayload } = diff
      return {
        action: 'update',
        id: originalItem.id,
        data: updatePayload,
      }
    }
  }

  // Если ничего не изменилось, или оба объекта отсутствуют.
  return null
}

type TransformationMap<TForm, TInitial> = {
  [K in keyof TForm]?: {
    // Ключ в финальном payload, например, 'dataGscOperation'
    targetKey: string
    // Функция-трансформер
    transformer: (initialValue: TInitial[keyof TInitial], formValue: TForm[K]) => any
  }
}

/**
 * Создает финальный объект (payload) для запроса на обновление.
 * Копирует все поля из formData, применяет трансформации для сложных полей
 * и удаляет исходные поля, которые были трансформированы.
 * @param initialData Исходные данные с сервера.
 * @param formData Данные из формы.
 * @param transformations Карта, описывающая, как трансформировать поля.
 * @returns Готовый для отправки на сервер объект.
 */
export function createUpdatePayload<
  TForm extends Record<string, any>,
  TInitial extends Record<string, any>,
>(initialData: TInitial, formData: TForm, transformations: TransformationMap<TForm, TInitial>) {
  // Начинаем с полной копии данных формы
  const payload: Record<string, any> = { ...formData }

  // Проходим по ключам, которые требуют трансформации
  for (const formKey in transformations) {
    if (Object.prototype.hasOwnProperty.call(transformations, formKey)) {
      const config = transformations[formKey]!
      const initialValue = initialData[formKey]
      const formValue = formData[formKey]

      // Выполняем преобразование
      payload[config.targetKey] = config.transformer(initialValue, formValue)

      // Удаляем исходный ключ из payload, он больше не нужен
      delete payload[formKey]
    }
  }

  return payload
}
