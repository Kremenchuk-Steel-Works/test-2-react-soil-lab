// src/shared/ui/react-hook-form/useFieldName.ts
import { useCallback } from 'react'
import type { ArrayPath, FieldValues, Path, PathValue } from 'react-hook-form'

/** Без префикса — ключи из всего T */
export function useFieldName<T extends FieldValues>(): <K extends Path<T>>(k: K) => Path<T>

/** Со статичным префиксом-ключом (поддерево) */
export function useFieldName<T extends FieldValues, P extends Path<T>>(
  prefix: P,
): <K extends Path<PathValue<T, P>>>(k: K) => Path<T>

export function useFieldName<T extends FieldValues, P extends Path<T>>(prefix?: P) {
  return useCallback(
    (k: string) => (prefix ? (`${prefix}.${k}` as Path<T>) : (k as Path<T>)),
    [prefix],
  )
}

/** Префикс для ЭЛЕМЕНТА массива формы */
type AnyElementPrefix<T extends FieldValues> = `${ArrayPath<T>}.${number}`

/** Ключи верхнего уровня S, значения которых — массивы */
type ArrayKeysOf<S> = {
  [K in keyof S]-?: S[K] extends readonly unknown[] ? K : never
}[keyof S]

/** Тип возвращаемого API: функция + helper’ы */
export type ScopedFieldNameFn<T extends FieldValues, S> = (<K extends Path<S>>(k: K) => Path<T>) & {
  /** Имя массива под префиксом (например, '...moldCores') */
  array: <K extends ArrayKeysOf<S>>(k: K) => ArrayPath<T>
}

/**
 * Динамический префикс (элемент массива) + строгие ключи поддерева S.
 * Возвращаем функция-неймер с доп. методом .array(...)
 */
export function useScopedFieldName<T extends FieldValues, S>(
  prefix: Path<T> | AnyElementPrefix<T>,
): ScopedFieldNameFn<T, S> {
  const field = useCallback(<K extends Path<S>>(k: K) => `${prefix}.${k}` as Path<T>, [prefix])
  const array = useCallback(
    <K extends ArrayKeysOf<S>>(k: K) => `${prefix}.${String(k)}` as ArrayPath<T>,
    [prefix],
  )

  // возвращаем функцию с "примонтированным" методом .array
  return Object.assign(field, { array }) as ScopedFieldNameFn<T, S>
}
