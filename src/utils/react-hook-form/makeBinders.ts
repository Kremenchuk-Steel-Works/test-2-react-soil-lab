import React, { type JSX } from 'react'
import type { FieldValues, Path } from 'react-hook-form'

export function makeBinders<T extends FieldValues, C>(ctxRef: React.RefObject<C>) {
  // F: Одиночное поле (name — string, return — условный тип)
  // Без пропсов (back-compat)
  function F<Name extends string>(
    name: Name,
    render: (name: Path<T>, ctx: C) => JSX.Element,
  ): Name extends Path<T> ? React.FC : never
  // С пропсами — как у V
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

  type TuplePaths<Keys extends readonly string[]> = {
    readonly [K in keyof Keys]: Keys[K] extends string ? Path<T> : never
  }

  /**
   * FA — сохраняем кортеж имен.
   * Ключевые моменты:
   *  - Keys — это массив ключей.
   *  - render получает именно Keys, поэтому внутри можно делать
   *    const [root, m1, m] = names;
   */
  function FA<const Keys extends readonly string[]>(
    names: Keys,
    render: (names: TuplePaths<Keys>, ctx: C) => JSX.Element,
  ): Exclude<Keys[number], Path<T>> extends never ? React.FC : never
  function FA<const Keys extends readonly string[], P extends object>(
    names: Keys,
    render: (names: TuplePaths<Keys>, props: P, ctx: C) => JSX.Element,
  ): Exclude<Keys[number], Path<T>> extends never ? React.FC<P> : never
  function FA<const Keys extends readonly string[], P extends object = Record<never, never>>(
    names: Keys,
    render:
      | ((names: TuplePaths<Keys>, ctx: C) => JSX.Element)
      | ((names: TuplePaths<Keys>, props: P, ctx: C) => JSX.Element),
  ) {
    const Comp = React.memo((props: unknown) => {
      const r = render as (ns: TuplePaths<Keys>, p: unknown, c: C) => JSX.Element
      // важно: передаём именно кортеж
      return r(names as unknown as TuplePaths<Keys>, props, ctxRef.current)
    })
    Comp.displayName = `FieldAll(${(names as readonly string[]).join(',')})`
    return Comp as unknown as Exclude<Keys[number], Path<T>> extends never
      ? P extends Record<never, never>
        ? React.FC
        : React.FC<P>
      : never
  }

  // V: View-компонент
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
