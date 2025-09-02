import type { Ref } from 'react'

/** Универсальный тип ref: callback или объектный, либо null/undefined */
export type AnyRef<T> = Ref<T | null> | null | undefined

/** Гард: callback-ref */
export function isRefCallback<T>(ref: AnyRef<T>): ref is (instance: T | null) => void {
  return typeof ref === 'function'
}

/** Гард: объектный ref с полем current (структурный, без MutableRefObject/RefObject) */
export function isObjectRef<T>(ref: AnyRef<T>): ref is { current: T | null } {
  return !!ref && typeof ref === 'object' && 'current' in ref
}

/** Безопасно присваиваем значение в ref (callback или объектный) */
export function setRef<T>(ref: AnyRef<T>, value: T | null): void {
  if (!ref) return
  if (isRefCallback(ref)) {
    ref(value)
  } else if (isObjectRef(ref)) {
    ref.current = value
  }
}

/** Типобезопасная композиция нескольких refs в единый ref-callback */
export function mergeRefs<T>(...refs: Array<AnyRef<T>>) {
  return (instance: T | null) => {
    for (const ref of refs) setRef(ref, instance)
  }
}

/**
 * Приводит Ref<unknown> к Ref<T> без `any`.
 * Нужен для либ, которые отдают слишком общий тип.
 */
export function castRef<T>(ref: Ref<unknown> | null | undefined): Ref<T | null> | null {
  if (!ref) return null
  if (typeof ref === 'function') {
    const fn = ref as (inst: unknown) => void
    return (inst: T | null) => fn(inst)
  }
  // здесь каст необходим (unknown -> { current: T | null }) и не считается "unnecessary"
  return ref as unknown as { current: T | null }
}
