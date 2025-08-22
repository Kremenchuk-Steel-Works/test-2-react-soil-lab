import { createContext, useContext, type ReactNode } from 'react'
import type { FieldValues } from 'react-hook-form'
import type { FormKit } from './formKit'

/** Контекст без привязки к типу — убираем проблему инвариантности */
const FormKitContext = createContext<unknown>(null)

/** Ловим неправильный объект в провайдере ещё на рантайме */
function assertFormKit(value: unknown): asserts value is FormKit<FieldValues> {
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

/** Типобезопасный generic-Provider: compile-time проверка value = FormKit<T> */
export function FormKitProvider<T extends FieldValues>({
  value,
  children,
}: {
  value: FormKit<T>
  children: ReactNode
}) {
  if (import.meta.env?.MODE !== 'production') {
    assertFormKit(value)
  }
  return <FormKitContext.Provider value={value as unknown}>{children}</FormKitContext.Provider>
}

/** Типобезопасный generic-hook: восстанавливаем точный тип формы в потребителе */
export function useFormKit<T extends FieldValues>(): FormKit<T> {
  const context = useContext(FormKitContext)
  if (context == null) {
    throw new Error('useFormKit must be used within a FormKitProvider')
  }
  return context as FormKit<T>
}
