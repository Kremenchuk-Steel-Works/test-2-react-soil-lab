import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFormContext, useWatch, type FieldPath, type FieldValues } from 'react-hook-form'
import {
  useActiveRules,
  useDynamicMeta,
} from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldsContext'

type BuildPayload<TValues extends FieldValues, TPayload> = (args: {
  base: Record<string, unknown>
  section: Record<string, unknown>
  all: TValues
}) => TPayload

export type UseSectionControllerArgs<
  TValues extends FieldValues,
  TPayload extends object,
  SectionKey extends string = string,
> = {
  sectionKey: SectionKey
  baseKeys: readonly FieldPath<TValues>[]
  onSubmit: (payload: TPayload) => Promise<unknown>
  buildPayload?: BuildPayload<TValues, TPayload>
  resetAfter?: boolean
}

function shallowArrayEqual(a?: unknown[], b?: unknown[]) {
  if (a === b) return true
  if (!a || !b) return false
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) if (!Object.is(a[i], b[i])) return false
  return true
}

export function useSectionController<
  TValues extends FieldValues,
  TPayload extends object = Record<string, unknown>,
>({
  sectionKey,
  baseKeys,
  onSubmit,
  buildPayload,
  resetAfter = true,
}: UseSectionControllerArgs<TValues, TPayload>) {
  const { sections } = useDynamicMeta()
  const active = useActiveRules()

  const { trigger, getValues, resetField, formState } = useFormContext<TValues>()

  // Вычисляем активные правила секции и её поля
  const { visible, sectionKeys } = useMemo(() => {
    const rules = sections[sectionKey] ?? []
    let isVisible = false
    const keys = new Set<string>()
    for (const r of rules) {
      if (!active[r.id]) continue
      isVisible = true
      const shape = r.schema?.shape ?? {}
      for (const k of Object.keys(shape)) keys.add(k)
    }
    return {
      visible: isVisible,
      sectionKeys: Array.from(keys) as FieldPath<TValues>[],
    }
  }, [sections, active, sectionKey])

  // Режим onChange после первой попытки отправки формы
  const [live, setLive] = useState(false)

  // Валидируем только базу + поля секции
  const namesToValidate = useMemo(
    () => [...baseKeys, ...sectionKeys] as FieldPath<TValues>[],
    [baseKeys, sectionKeys],
  )

  // Подписка появляется только в live и только на наши поля
  const watched = useWatch<TValues>({
    name: namesToValidate,
    disabled: !live || namesToValidate.length === 0,
  }) as unknown[]

  const prevRef = useRef<unknown[] | undefined>(undefined)
  const stableNames = useMemo(() => namesToValidate.slice(), [namesToValidate])

  useEffect(() => {
    if (!live || stableNames.length === 0) return
    if (shallowArrayEqual(prevRef.current, watched)) return
    prevRef.current = watched
    void trigger(stableNames, { shouldFocus: false })
  }, [live, watched, stableNames, trigger])

  // Submit секции
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submit = useCallback(async () => {
    setLive(true) // включаем live с первой попытки

    const ok = await trigger(stableNames, { shouldFocus: true })
    if (!ok) return

    const all = getValues()

    const base: Record<string, unknown> = {}
    for (const k of baseKeys) base[k as string] = all[k as keyof TValues]

    const sect: Record<string, unknown> = {}
    for (const k of sectionKeys) sect[k as string] = all[k as keyof TValues]

    const payload =
      buildPayload?.({ base, section: sect, all }) ?? ({ ...base, ...sect } as unknown as TPayload)

    try {
      setIsSubmitting(true)
      await onSubmit(payload)
      if (resetAfter) {
        for (const k of sectionKeys) {
          resetField(k, { keepDirty: false, keepError: false, keepTouched: false })
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }, [
    trigger,
    stableNames,
    getValues,
    baseKeys,
    sectionKeys,
    buildPayload,
    onSubmit,
    resetAfter,
    resetField,
  ])

  return {
    visible,
    submit,
    isSubmitting,
    isFormSubmitting: formState.isSubmitting,
  }
}
