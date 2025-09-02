import type { ReactNode } from 'react'
import type { FieldValues } from 'react-hook-form'
import type { FormKit } from './formKit'
import { assertFormKit, FormKitContext } from './formKitContext'

/** Типобезопасный generic-Provider: compile-time проверка value = FormKit<T> */
export function FormKitProvider<T extends FieldValues>({
  value,
  children,
}: {
  value: FormKit<T>
  children: ReactNode
}) {
  if (import.meta.env.MODE !== 'production') {
    assertFormKit(value)
  }
  return <FormKitContext.Provider value={value as unknown}>{children}</FormKitContext.Provider>
}
