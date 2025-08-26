import React, { type JSX } from 'react'
import type { FieldValues, Path } from 'react-hook-form'

export function makeBinders<T extends FieldValues, C>(ctxRef: React.RefObject<C>) {
  function F<Name extends string>(
    name: Name,
    render: (name: Path<T>, ctx: C) => JSX.Element,
  ): Name extends Path<T> ? React.FC : never {
    const Comp: React.FC = React.memo(() => render(name as unknown as Path<T>, ctxRef.current))
    Comp.displayName = `Field(${String(name)})`
    return Comp as unknown as Name extends Path<T> ? React.FC : never
  }

  function FA<Keys extends readonly string[]>(
    names: Keys,
    render: (names: Path<T>[], ctx: C) => JSX.Element,
  ): Exclude<Keys[number], Path<T>> extends never ? React.FC : never {
    const Comp: React.FC = React.memo(() => render(names as unknown as Path<T>[], ctxRef.current))
    Comp.displayName = `FieldAll(${(names as readonly string[]).join(',')})`
    return Comp as unknown as Exclude<Keys[number], Path<T>> extends never ? React.FC : never
  }

  return { F, FA }
}

export const memoNamed = <P>(name: string, Comp: React.FC<P>) => {
  const M = React.memo(Comp)
  M.displayName = name
  return M
}
