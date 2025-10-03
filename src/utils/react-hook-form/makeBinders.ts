// utils/react-hook-form/makeBinders.ts
import React, { type JSX } from 'react'
import type { FieldValues, Path } from 'react-hook-form'

export function makeBinders<T extends FieldValues, C>(ctxRef: React.RefObject<C>) {
  // -------- F: одиночное поле (name — string, return — условный тип) --------
  // 1) Без пропсов (back-compat)
  function F<Name extends string>(
    name: Name,
    render: (name: Path<T>, ctx: C) => JSX.Element,
  ): Name extends Path<T> ? React.FC : never
  // 2) С пропсами — как у V
  function F<Name extends string, P extends object>(
    name: Name,
    render: (name: Path<T>, props: P, ctx: C) => JSX.Element,
  ): Name extends Path<T> ? React.FC<P> : never
  // Реализация
  function F<Name extends string, P extends object = Record<never, never>>(
    name: Name,
    render:
      | ((name: Path<T>, ctx: C) => JSX.Element)
      | ((name: Path<T>, props: P, ctx: C) => JSX.Element),
  ) {
    const Comp = React.memo((props: unknown) => {
      // Всегда зовём (name, props, ctx). Если колбэк без props — лишний аргумент игнорируется.
      const r = render as (n: Path<T>, p: unknown, c: C) => JSX.Element
      return r(name as unknown as Path<T>, props, ctxRef.current)
    })
    Comp.displayName = `Field(${String(name)})`
    // Возвращаем тип согласно перегрузкам: FC или FC<P>
    return Comp as unknown as Name extends Path<T>
      ? P extends Record<never, never>
        ? React.FC
        : React.FC<P>
      : never
  }

  // -------- FA: набор имён (по той же логике) --------
  function FA<Keys extends readonly string[]>(
    names: Keys,
    render: (names: Path<T>[], ctx: C) => JSX.Element,
  ): Exclude<Keys[number], Path<T>> extends never ? React.FC : never
  function FA<Keys extends readonly string[], P extends object>(
    names: Keys,
    render: (names: Path<T>[], props: P, ctx: C) => JSX.Element,
  ): Exclude<Keys[number], Path<T>> extends never ? React.FC<P> : never
  function FA<Keys extends readonly string[], P extends object = Record<never, never>>(
    names: Keys,
    render:
      | ((names: Path<T>[], ctx: C) => JSX.Element)
      | ((names: Path<T>[], props: P, ctx: C) => JSX.Element),
  ) {
    const Comp = React.memo((props: unknown) => {
      const r = render as (ns: Path<T>[], p: unknown, c: C) => JSX.Element
      return r(names as unknown as Path<T>[], props, ctxRef.current)
    })
    Comp.displayName = `FieldAll(${(names as readonly string[]).join(',')})`
    return Comp as unknown as Exclude<Keys[number], Path<T>> extends never
      ? P extends Record<never, never>
        ? React.FC
        : React.FC<P>
      : never
  }

  // -------- V: view-компонент --------
  function V<P extends object = Record<string, never>>(
    displayName: string,
    Comp: React.FC<P>,
  ): React.FC<P> {
    const M = React.memo(Comp)
    M.displayName = displayName
    return M
  }

  return { F, FA, V }
}
