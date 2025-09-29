import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFormContext, useWatch, type FieldPath, type FieldValues } from 'react-hook-form'
import { type ZodObject, type ZodRawShape } from 'zod'
import { applyServerErrors } from '@/shared/lib/axios/applyServerErrors'
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

const toPickShape = (keys: string[]) =>
  Object.fromEntries(keys.map((k) => [k, true])) as Record<string, true>

const intersectKeysWithSchema = (keys: string[], schema: ZodObject<ZodRawShape>) =>
  keys.filter((k) => Object.prototype.hasOwnProperty.call(schema.shape, k))

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
  const { sections, valueNormalizer, basePickParse } = useDynamicMeta()
  const active = useActiveRules()
  const { trigger, getValues, resetField, setError, setFocus, formState } =
    useFormContext<TValues>()

  const normalizeObject = useCallback(
    (obj: Record<string, unknown>) => {
      if (!valueNormalizer) return obj
      const out: Record<string, unknown> = {}
      for (const [k, v] of Object.entries(obj)) out[k] = valueNormalizer(k, v)
      return out
    },
    [valueNormalizer],
  )

  const { visible, sectionKeys } = useMemo(() => {
    const rules =
      (sections as Record<string, ReadonlyArray<{ id: string; schema?: unknown }>>)[sectionKey] ??
      []
    let isVisible = false
    const keys = new Set<string>()
    for (const r of rules) {
      if (!active[r.id]) continue
      isVisible = true
      const shape = (r.schema as ZodObject<ZodRawShape> | undefined)?.shape ?? {}
      for (const k of Object.keys(shape)) keys.add(k)
    }
    return { visible: isVisible, sectionKeys: Array.from(keys) as FieldPath<TValues>[] }
  }, [sections, active, sectionKey])

  const sectionRuleSchemas = useMemo(() => {
    const rules =
      (sections as Record<string, ReadonlyArray<{ id: string; schema?: unknown }>>)[sectionKey] ??
      []
    return rules
      .filter(
        (r) => active[r.id] && r.schema && (r.schema as ZodObject<ZodRawShape> | undefined)?.shape,
      )
      .map((r) => r.schema as ZodObject<ZodRawShape>)
  }, [sections, active, sectionKey])

  const [live, setLive] = useState(false)
  const namesToValidate = useMemo(
    () => [...baseKeys, ...sectionKeys] as FieldPath<TValues>[],
    [baseKeys, sectionKeys],
  )
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

  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = useCallback(async () => {
    setLive(true)
    const ok = await trigger(stableNames, { shouldFocus: true })
    if (!ok) return

    const rawAll = getValues()
    let merged: Record<string, unknown> = normalizeObject(
      rawAll as unknown as Record<string, unknown>,
    )

    if (basePickParse && baseKeys.length) {
      const baseKeyStrings = (baseKeys as ReadonlyArray<string>).map(String)
      const parsedBase = basePickParse(baseKeyStrings, merged)
      merged = { ...merged, ...parsedBase }
    }

    const sectionKeyStrings = (sectionKeys as string[]) ?? []
    for (const schema of sectionRuleSchemas) {
      const keysForRule = intersectKeysWithSchema(sectionKeyStrings, schema)
      if (keysForRule.length === 0) continue
      const pickSchema = schema.pick(toPickShape(keysForRule))
      const subsetInput = Object.fromEntries(keysForRule.map((k) => [k, merged[k]]))
      const parsed = pickSchema.safeParse(subsetInput)
      if (parsed.success) merged = { ...merged, ...parsed.data }
    }

    const normalizedAll = merged as unknown as TValues
    const base: Record<string, unknown> = {}
    for (const k of baseKeys) base[k as string] = normalizedAll[k as keyof TValues]
    const sect: Record<string, unknown> = {}
    for (const k of sectionKeys) sect[k as string] = normalizedAll[k as keyof TValues]

    const payload =
      buildPayload?.({ base, section: sect, all: normalizedAll }) ??
      ({ ...base, ...sect } as unknown as TPayload)

    try {
      setIsSubmitting(true)
      await onSubmit(payload)
      if (resetAfter) {
        for (const k of sectionKeys)
          resetField(k, { keepDirty: false, keepError: false, keepTouched: false })
      }
    } catch (err) {
      applyServerErrors<TValues>({
        err,
        getValues,
        setError,
        setFocus,
      })
      return
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
    normalizeObject,
    basePickParse,
    sectionRuleSchemas,
    setError,
    setFocus,
  ])

  return { visible, submit, isSubmitting, isFormSubmitting: formState.isSubmitting }
}
