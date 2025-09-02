import { useContext } from 'react'
import type { FieldValues } from 'react-hook-form'
import type { FormKit } from './formKit'
import { FormKitContext } from './formKitContext'

/** Типобезопасный generic-hook: восстанавливаем точный тип формы в потребителе */
export function useFormKit<T extends FieldValues>(): FormKit<T> {
  const context = useContext(FormKitContext)
  if (context == null) {
    throw new Error('useFormKit must be used within a FormKitProvider')
  }
  return context as FormKit<T>
}
