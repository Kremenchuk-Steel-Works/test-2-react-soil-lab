import equal from 'fast-deep-equal'

type Id = string | number
type AnyRecord = Record<string, unknown>
type MaybeWithId = AnyRecord & { id?: unknown }
type WithId = { id: Id }

// Операции API
export type ApiArrayOperation<T extends { id: Id }> =
  | { action: 'create'; data: Omit<T, 'id'> }
  | { action: 'update'; id: T['id']; data: Record<string, unknown> }
  | { action: 'delete'; id: T['id'] }

// для OBJECT-операций разрешаем отсутствие id (singleton-объекты)
export type ApiObjectOperation<T extends AnyRecord> =
  | { action: 'create'; data: Omit<T, 'id'> }
  | { action: 'update'; data: Partial<Omit<T, 'id'>>; id?: Id }
  | { action: 'delete'; id?: Id }

// Утилиты
const isDefined = <T>(v: T | null | undefined): v is T => v !== undefined && v !== null

const hasId = (obj: unknown): obj is WithId => {
  if (typeof obj !== 'object' || obj === null) return false
  const maybe = obj as { id?: unknown }
  return isDefined(maybe.id) && (typeof maybe.id === 'string' || typeof maybe.id === 'number')
}

const omitIdFrom = <T extends MaybeWithId>(obj: T): Omit<T, 'id'> => {
  const { id, ...rest } = obj
  void id
  return rest
}

function getObjectDiff<T extends AnyRecord>(original: T, current: T): Partial<T> {
  const diff: Partial<T> = {}
  for (const key in current) {
    if (!Object.prototype.hasOwnProperty.call(current, key)) continue
    if (key === 'id') continue // id никогда не апдейтим
    const k = key as keyof T
    if (!equal(original[k], current[k])) {
      // ВАЖНО: если нужно «очистить» поле — в форме необходимо null, не undefined.
      diff[k] = current[k]
    }
  }
  return diff
}

function createApiObjectOperation<T extends AnyRecord>(
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
    const data = omitIdFrom(currentItem as unknown as MaybeWithId) as Omit<T, 'id'>
    return { action: 'create', data }
  }
  if (!hasCurrent && hasOriginal) {
    if (useId && hasId(originalItem)) {
      return { action: 'delete', id: originalItem.id }
    }
    return { action: 'delete' }
  }
  if (hasCurrent && hasOriginal) {
    const diff = getObjectDiff(originalItem, currentItem)
    if (Object.keys(diff).length > 0) {
      const updatePayload = omitIdFrom(diff as MaybeWithId) as Partial<Omit<T, 'id'>>
      if (useId) {
        const idForUpdate: Id | undefined = hasId(originalItem)
          ? originalItem.id
          : hasId(currentItem)
            ? currentItem.id
            : undefined
        if (isDefined(idForUpdate)) {
          return { action: 'update', id: idForUpdate, data: updatePayload }
        }
      }
      return { action: 'update', data: updatePayload }
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
      const data = omitIdFrom(currentItem as unknown as MaybeWithId) as Omit<T, 'id'>
      operations.push({ action: 'create', data })
    } else {
      const originalItem = originalMap.get(id)!
      const diff = getObjectDiff(originalItem, currentItem)
      if (Object.keys(diff).length > 0) {
        const updatePayload = omitIdFrom(diff as MaybeWithId) as Record<string, unknown>
        operations.push({ action: 'update', id, data: updatePayload })
      }
    }
  }
  return operations
}

// Декларативные правила трансформации
export type TransformationRule =
  | { type: 'object'; targetKey: string; singleton?: boolean } // singleton -> операции без id
  | { type: 'array'; targetKey: string; nested?: TransformMap<unknown> }

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
  const keysToStrip = Object.keys(nested) as ReadonlyArray<string> // исходные поля, которые заменяются nested-операциями

  const mapped = baseOps
    .map((op) => {
      if (op.action === 'update') {
        const initialItem = initialMap.get(op.id)
        const currentItem = currentArray.find((x) => x.id === op.id)
        if (initialItem && currentItem) {
          const nestedPayload = createUpdatePayload(initialItem, currentItem, nested)

          // удалить сырые поля (например, moldCores) из обычного диффа
          if (op.data) {
            for (const key of keysToStrip) {
              delete op.data[key]
            }
          }
          // добавить операции (например, moldCoreOperations)
          op.data = { ...(op.data ?? {}), ...nestedPayload }
        }
      }
      return op
    })
    // если после всего data пустое — такой update не нужен
    .filter((op) => !(op.action === 'update' && (!op.data || Object.keys(op.data).length === 0)))

  return mapped
}

/**
 * Главная функция: собирает payload на основе diff + правил трансформации.
 * initial и form — одного шэйпа (нормализованные данные формы).
 */
export function createUpdatePayload<T extends AnyRecord>(
  initialData: T,
  formData: T,
  transformations: TransformMap<T> = {} as TransformMap<T>,
): Record<string, unknown> {
  const payload: Record<string, unknown> = { ...getObjectDiff(initialData, formData) }

  for (const key in transformations) {
    if (!Object.prototype.hasOwnProperty.call(transformations, key)) continue
    const rule = transformations[key as keyof T]!
    const initial = initialData[key as keyof T] as unknown
    const current = formData[key as keyof T] as unknown

    let result: unknown = null
    if (rule.type === 'object') {
      result = createApiObjectOperation(
        initial as AnyRecord | null | undefined,
        current as AnyRecord | null | undefined,
        {
          forceSingleton: Boolean((rule as { singleton?: boolean }).singleton),
        },
      )
    } else if (rule.type === 'array') {
      const initialArr = (Array.isArray(initial) ? (initial as Array<{ id: Id }>) : []) as Array<{
        id: Id
      }>
      const currentArr = (Array.isArray(current) ? (current as Array<{ id: Id }>) : []) as Array<{
        id: Id
      }>
      result = processArrayRecursively(
        initialArr,
        currentArr,
        rule.nested as TransformMap<{ id: Id }>,
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
