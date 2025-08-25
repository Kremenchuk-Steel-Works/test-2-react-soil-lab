// src/shared/lib/formUtils.ts
import type { JSX } from 'react'
import type { FieldValues, Path } from 'react-hook-form'

/**
 * Создает "биндер" для одного поля формы.
 * Гарантирует, что имя поля существует в типе формы T.
 * @param ctx Контекст, который будет доступен внутри рендера поля.
 */
export function createFieldBinder<T extends FieldValues, Ctx>(ctx: Ctx) {
  return function <Name extends string>(
    name: Name,
    render: (name: Path<T>, ctx: Ctx) => JSX.Element,
  ): Name extends Path<T> ? () => JSX.Element : never {
    const FieldComponent = () => render(name as unknown as Path<T>, ctx)
    return FieldComponent as Name extends Path<T> ? () => JSX.Element : never
  }
}

/**
 * Создает "биндер" для группы полей формы.
 * Гарантирует, что все имена полей существуют в типе формы T.
 * @param ctx Контекст, который будет доступен внутри рендера полей.
 */
export function createFieldsBinder<T extends FieldValues, Ctx>(ctx: Ctx) {
  return function <Keys extends readonly string[]>(
    names: Keys,
    render: (names: Path<T>[], ctx: Ctx) => JSX.Element,
  ): Exclude<Keys[number], Path<T>> extends never ? () => JSX.Element : never {
    const FieldsComponent = () => render(names as unknown as Path<T>[], ctx)
    return FieldsComponent as Exclude<Keys[number], Path<T>> extends never
      ? () => JSX.Element
      : never
  }
}
