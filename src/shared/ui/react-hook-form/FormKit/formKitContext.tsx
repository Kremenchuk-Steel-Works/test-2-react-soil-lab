import { createContext } from 'react'
import type { FieldValues } from 'react-hook-form'
import type { FormKit } from './formKit'

/** Контекст без привязки к типу — убираем проблему инвариантности */
export const FormKitContext = createContext<unknown>(null)

/** Рантайм-гард только в деве — ловим неправильный объект в провайдере */
export function assertFormKit(value: unknown): asserts value is FormKit<FieldValues> {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('Field' in value) ||
    !('Controller' in value) ||
    !('WithError' in value)
  ) {
    throw new Error('Provided value to FormKitProvider is not a valid FormKit object')
  }
}
