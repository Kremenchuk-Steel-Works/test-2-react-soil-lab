// src/shared/lib/react-hook-form/resolvers/stableZodResolver.ts
import { zodResolver } from '@hookform/resolvers/zod'
import type { FieldErrors, Resolver } from 'react-hook-form'
import { z } from 'zod'

type AnyZod = z.ZodTypeAny

const ARRAY_ERROR_TYPES = new Set(['too_small', 'too_big', 'nonempty'])

/**
 * Финальная версия нормализатора.
 * - Игнорирует `ref` для защиты от бесконечной рекурсии.
 * - Преобразует в `{ root: ... }` только ошибки уровня массива.
 * - Оставляет стандартные ошибки для простых полей.
 * - Если для массива есть root-ошибка, удаляет вложенные индексные ошибки.
 */
function normalizeErrors(node: any): any {
  // 1. Защита от рекурсии и обработка конечных узлов.
  // Игнорируем все, что не является чистым объектом.
  if (node == null || typeof node !== 'object' || node.constructor !== Object) {
    return node
  }

  const result: any = {}
  let isArrayLevelErrorPresent = false

  // 2. Сначала рекурсивно обрабатываем всех детей.
  for (const key in node) {
    // Пропускаем 'ref', чтобы избежать падения.
    if (key === 'ref') {
      result[key] = node[key] // Копируем ref как есть, не углубляясь.
      continue
    }
    // Остальные дети обрабатываем рекурсивно.
    result[key] = normalizeErrors(node[key])
  }

  // 3. Теперь, когда дети обработаны, анализируем сам узел (`result`).
  const isLeafError = typeof result.message === 'string'
  if (isLeafError && ARRAY_ERROR_TYPES.has(result.type)) {
    // Это ошибка уровня массива. Преобразуем ее.
    const { message, type } = result
    // Удаляем исходные message/type и добавляем `root`.
    delete result.message
    delete result.type
    result.root = { message, type }
    isArrayLevelErrorPresent = true
  }

  // 4. Финальная очистка: если мы нашли ошибку уровня массива,
  // удаляем все дочерние индексные ошибки ('0', '1', ...).
  if (isArrayLevelErrorPresent) {
    for (const key in result) {
      if (!isNaN(Number(key))) {
        delete result[key]
      }
    }
  }

  return result
}

export function stableZodResolver<TSchema extends AnyZod>(
  schema: TSchema,
): Resolver<z.infer<TSchema>> {
  const baseResolver = zodResolver(schema)

  return async (values, context, options) => {
    const result = await baseResolver(values, context, options)

    if (!result.errors) {
      return result
    }

    const normalizedErrors = normalizeErrors(result.errors)

    return {
      values: result.values,
      errors: (normalizedErrors ?? {}) as FieldErrors<z.infer<TSchema>>,
    }
  }
}
