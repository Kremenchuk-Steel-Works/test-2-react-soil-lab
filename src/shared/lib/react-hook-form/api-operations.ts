// src/shared/lib/api-payload.ts
// Универсальный генератор payload для API-операций (объекты/массивы/вложенные списки)

import equal from 'fast-deep-equal'

type Id = string | number

// --- Операции API ---
export type ApiArrayOperation<T extends { id: Id }> =
  | { action: 'create'; data: Omit<T, 'id'> }
  | { action: 'update'; id: T['id']; data: Record<string, unknown> }
  | { action: 'delete'; id: T['id'] }

export type ApiObjectOperation<T extends { id: Id }> =
  | { action: 'create'; data: Omit<T, 'id'> }
  | { action: 'update'; id: T['id']; data: Partial<Omit<T, 'id'>> }
  | { action: 'delete'; id: T['id'] }

// --- Утилиты ---
const isDefined = <T>(v: T | null | undefined): v is T => v !== undefined && v !== null

function getObjectDiff<T extends Record<string, any>>(original: T, current: T): Partial<T> {
  const diff: Partial<T> = {}
  for (const key in current) {
    if (!Object.prototype.hasOwnProperty.call(current, key)) continue
    if (!equal(original[key], current[key])) {
      // ВАЖНО: если нужно «очистить» поле — в форме ставь null, не undefined.
      diff[key] = current[key]
    }
  }
  return diff
}

function createApiObjectOperation<T extends { id: Id }>(
  originalItem: T | null | undefined,
  currentItem: T | null | undefined,
): ApiObjectOperation<T> | null {
  const hasOriginal = isDefined(originalItem) && isDefined(originalItem.id)
  const hasCurrent = isDefined(currentItem)

  if (hasCurrent && !hasOriginal) {
    const { id: _omit, ...data } = currentItem as T
    return { action: 'create', data }
  }
  if (!hasCurrent && hasOriginal) {
    return { action: 'delete', id: (originalItem as T).id }
  }
  if (hasCurrent && hasOriginal) {
    const diff = getObjectDiff(originalItem as any, currentItem as any)
    if (Object.keys(diff).length > 0) {
      const { id: _omit, ...updatePayload } = diff as any
      return { action: 'update', id: (originalItem as T).id, data: updatePayload }
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
  | { type: 'object'; targetKey: string }
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
 * Плюс: мы вычищаем из update-диффа сырые массивы, заменяемые на ...Operations
 * (например, moldCores -> moldCoreOperations), чтобы не слать два поля одновременно.
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

  return baseOps.map((op) => {
    if (op.action === 'update') {
      const initialItem = initialMap.get(op.id)
      const currentItem = currentArray.find((x) => x.id === op.id)
      if (initialItem && currentItem) {
        const nestedPayload = createUpdatePayload(initialItem, currentItem, nested)

        // 1) удалить сырые поля (например, moldCores) из обычного диффа
        if (op.data) {
          for (const key of keysToStrip) {
            delete (op.data as any)[key]
          }
        }
        // 2) добавить операции (например, moldCoreOperations)
        op.data = { ...(op.data ?? {}), ...nestedPayload }
      }
    }
    // ВАЖНО: в CREATE ничего не трогаем — нужны именно сырые данные.
    return op
  })
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
      result = createApiObjectOperation(initial, current)
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
