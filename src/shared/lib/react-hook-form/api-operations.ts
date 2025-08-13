import equal from 'fast-deep-equal'

type Id = string | number

// --- Операции API ---
export type ApiArrayOperation<T extends { id: Id }> =
  | { action: 'create'; data: Omit<T, 'id'> }
  | { action: 'update'; id: T['id']; data: Record<string, unknown> }
  | { action: 'delete'; id: T['id'] }

// NB: для OBJECT-операций разрешаем отсутствие id (singleton-объекты)
export type ApiObjectOperation<T extends Record<string, any>> =
  | { action: 'create'; data: Omit<T, 'id'> }
  | { action: 'update'; data: Partial<Omit<T, 'id'>>; id?: Id }
  | { action: 'delete'; id?: Id }

// --- Утилиты ---
const isDefined = <T>(v: T | null | undefined): v is T => v !== undefined && v !== null
const hasId = (obj: any): obj is { id: Id } => !!obj && 'id' in obj && isDefined(obj.id)

function getObjectDiff<T extends Record<string, any>>(original: T, current: T): Partial<T> {
  const diff: Partial<T> = {}
  for (const key in current) {
    if (!Object.prototype.hasOwnProperty.call(current, key)) continue
    if (key === 'id') continue // id никогда не апдейтим
    if (!equal(original[key], current[key])) {
      // ВАЖНО: если нужно «очистить» поле — в форме ставь null, не undefined.
      diff[key] = current[key]
    }
  }
  return diff
}

function createApiObjectOperation<T extends Record<string, any>>(
  originalItem: T | null | undefined,
  currentItem: T | null | undefined,
  opts?: { forceSingleton?: boolean },
): ApiObjectOperation<T> | null {
  const hasOriginal = isDefined(originalItem)
  const hasCurrent = isDefined(currentItem)

  // Определяем режим: по явному флагу или по наличию id
  const useId =
    !opts?.forceSingleton &&
    ((hasOriginal && hasId(originalItem)) || (hasCurrent && hasId(currentItem)))

  if (hasCurrent && !hasOriginal) {
    const { id: _omit, ...data } = currentItem as T
    return { action: 'create', data }
  }
  if (!hasCurrent && hasOriginal) {
    return useId ? { action: 'delete', id: (originalItem as any).id } : { action: 'delete' }
  }
  if (hasCurrent && hasOriginal) {
    const diff = getObjectDiff(originalItem as any, currentItem as any)
    if (Object.keys(diff).length > 0) {
      const { id: _omit, ...updatePayload } = diff as any
      return useId
        ? { action: 'update', id: (originalItem as any).id, data: updatePayload }
        : { action: 'update', data: updatePayload }
    }
  }
  return null
}

function createBaseApiArrayOperations<T extends { id: Id }>(
  originalItems: T[] = [],
  currentItems: T[] = [],
): ApiArrayOperation<T>[] {
  const operations: ApiArrayOperation<T>[] = []
  const originalMap = new Map(originalItems.map((item) => [item.id, item]))
  const currentIds = new Set(
    currentItems.map((item) => item.id).filter((id): id is Id => isDefined(id)),
  )

  // delete
  for (const originalItem of originalItems) {
    if (!currentIds.has(originalItem.id)) {
      operations.push({ action: 'delete', id: originalItem.id })
    }
  }

  // create / update
  for (const currentItem of currentItems) {
    const { id } = currentItem
    if (!isDefined(id) || !originalMap.has(id)) {
      const { id: _omit, ...data } = currentItem as T
      operations.push({ action: 'create', data })
    } else {
      const originalItem = originalMap.get(id)!
      const diff = getObjectDiff(originalItem as any, currentItem as any)
      if (Object.keys(diff).length > 0) {
        const { id: _omit, ...updatePayload } = diff as any
        operations.push({ action: 'update', id, data: updatePayload })
      }
    }
  }
  return operations
}

// --- Декларативные правила трансформации ---
export type TransformationRule =
  | { type: 'object'; targetKey: string; singleton?: boolean } // singleton -> операции без id
  | { type: 'array'; targetKey: string; nested?: TransformMap<any> }

/**
 * Карта трансформаций: ключи исходной формы -> правила преобразования.
 */
export type TransformMap<T> = {
  [K in keyof T]?: TransformationRule
}

/**
 * Рекурсивно обрабатывает массив: вложенные операции добавляем ТОЛЬКО в update.
 * Для create оставляем сырые данные сущности (Omit<T,'id'>).
 * Плюс: вычищаем из update-диффа сырые массивы (которые заменяются ...Operations).
 * Дополнительно: отсекаем update c пустым data, если после чистки/вложенных операций ничего не осталось.
 */
function processArrayRecursively<TItem extends { id: Id }>(
  initialArray: TItem[] = [],
  currentArray: TItem[] = [],
  nested?: TransformMap<TItem>,
): ApiArrayOperation<TItem>[] {
  const baseOps = createBaseApiArrayOperations(initialArray, currentArray)
  if (!nested) return baseOps

  const initialMap = new Map(initialArray.map((x) => [x.id, x]))
  const keysToStrip = Object.keys(nested) // исходные поля, которые заменяются nested-операциями

  const mapped = baseOps
    .map((op) => {
      if (op.action === 'update') {
        const initialItem = initialMap.get(op.id)
        const currentItem = currentArray.find((x) => x.id === op.id)
        if (initialItem && currentItem) {
          const nestedPayload = createUpdatePayload(initialItem, currentItem, nested)

          // 1) удалить сырые поля (например, moldCores) из обычного диффа
          if (op.data) {
            for (const key of keysToStrip) delete (op.data as any)[key]
          }
          // 2) добавить операции (например, moldCoreOperations)
          op.data = { ...(op.data ?? {}), ...nestedPayload }
        }
      }
      return op
    })
    // 3) если после всего data пустое — такой update не нужен
    .filter((op) => !(op.action === 'update' && (!op.data || Object.keys(op.data).length === 0)))

  return mapped
}

/**
 * Главная функция: собирает payload на основе diff + правил трансформации.
 * initial и form — одного шэйпа (нормализованные данные формы).
 */
export function createUpdatePayload<T extends Record<string, any>>(
  initialData: T,
  formData: T,
  transformations: TransformMap<T>,
): Record<string, any> {
  const payload: Record<string, any> = { ...getObjectDiff(initialData, formData) }

  for (const key in transformations) {
    if (!Object.prototype.hasOwnProperty.call(transformations, key)) continue
    const rule = transformations[key as keyof T]!
    const initial = (initialData as any)[key]
    const current = (formData as any)[key]

    let result: any = null
    if (rule.type === 'object') {
      result = createApiObjectOperation(initial, current, {
        forceSingleton: !!(rule as any).singleton,
      })
    } else if (rule.type === 'array') {
      result = processArrayRecursively(
        initial ?? [],
        current ?? [],
        rule.nested as TransformMap<any>,
      )
    }

    if (result && (!Array.isArray(result) || result.length > 0)) {
      payload[rule.targetKey] = result
    }
    // вычищаем исходное поле, чтобы не слать и raw-данные, и ...Operation одновременно
    delete payload[key]
  }

  return payload
}
