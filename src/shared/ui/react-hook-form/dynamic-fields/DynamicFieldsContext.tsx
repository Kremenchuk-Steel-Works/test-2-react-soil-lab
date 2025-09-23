import { createContext, memo, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react'
import {
  useFormContext,
  useWatch,
  type FieldPath,
  type FieldValues,
  type Mode,
} from 'react-hook-form'
import { createLogger } from '@/shared/lib/logger'
import {
  checkConditions,
  flattenRules,
  type DynamicSectionsConfig,
  type ValueNormalizer,
} from '@/shared/lib/zod/dynamic-sections'
import { selectCandidatesFromTree } from '@/shared/lib/zod/dynamic-sections-scoped'

const logger = createLogger('DynamicFields')

type ActiveRulesState<RuleKey extends string = string> = Record<RuleKey, boolean>

type DynamicMeta<TOptions extends object, TResponseData, SectionKey extends string> = {
  sections: DynamicSectionsConfig<SectionKey>
  options?: TOptions
  responseData?: TResponseData
  valueNormalizer?: ValueNormalizer
  basePickParse?: (keys: string[], input: Record<string, unknown>) => Record<string, unknown>
}

const ActiveRulesContext = createContext<ActiveRulesState<string> | null>(null)
const DynamicMetaContext = createContext<DynamicMeta<object, unknown, string> | null>(null)

interface ProviderProps<
  TOptions extends object,
  TResponseData,
  SectionKey extends string = string,
> {
  sections: DynamicSectionsConfig<SectionKey>
  options?: TOptions
  responseData?: TResponseData
  valueNormalizer?: ValueNormalizer
  basePickParse?: (keys: string[], input: Record<string, unknown>) => Record<string, unknown>
  clearErrorsForUnrequired?: boolean
  /** Опционально: форсировать режим (перекрывает auto-детект из RHF) */
  forceValidationMode?: Mode
  children: ReactNode
}

/** Безопасно читаем режимы из RHF (внутреннее поле, но с защитой и без избыточных assertion) */
type RHFPrivateOpts = { mode?: Mode; reValidateMode?: 'onChange' | 'onBlur' }
function useResolvedModes(): { mode: Mode; reValidateMode: 'onChange' | 'onBlur' } {
  const { control } = useFormContext()
  const opts: RHFPrivateOpts | undefined = (control as unknown as { _options?: RHFPrivateOpts })
    ?._options
  const mode: Mode = opts?.mode ?? 'onSubmit'
  const reValidateMode: 'onChange' | 'onBlur' = opts?.reValidateMode ?? 'onChange'
  return { mode, reValidateMode }
}

export const DynamicFieldsProvider = memo(function DynamicFieldsProvider<
  TFieldValues extends FieldValues,
  TOptions extends object,
  TResponseData,
  SectionKey extends string = string,
>({
  children,
  sections,
  options,
  responseData,
  valueNormalizer,
  basePickParse,
  clearErrorsForUnrequired = true,
  forceValidationMode,
}: ProviderProps<TOptions, TResponseData, SectionKey>) {
  const { control, getValues, resetField, clearErrors, trigger, formState, getFieldState } =
    useFormContext<TFieldValues>()

  const { mode: autoMode } = useResolvedModes()
  const validationMode: Mode = forceValidationMode ?? autoMode

  const allRules = useMemo(
    () => flattenRules(sections) as ReadonlyArray<Parameters<typeof checkConditions>[1]>,
    [sections],
  )

  // ruleIndex -> keys[]
  const ruleIdxToKeys = useMemo(() => {
    return allRules.map((r) =>
      Object.keys((r as { schema?: { shape?: Record<string, unknown> } }).schema?.shape ?? {}),
    )
  }, [allRules])

  // === ВАЖНО: мапа смещений секций → глобальный индекс (как в resolver) ===
  const sectionToOffsets = useMemo(() => {
    let offset = 0
    const map = new Map<string, number>()
    for (const [sectionKey, arr] of Object.entries(
      sections as unknown as Record<string, unknown[]>,
    )) {
      map.set(sectionKey, offset)
      offset += arr?.length ?? 0
    }
    return map
  }, [sections])

  // подписка только на поля, влияющие на условия/исключения (как было)
  const fieldsToWatch = useMemo(() => {
    const set = new Set<string>()
    for (const r of allRules) {
      if (r.conditions) Object.keys(r.conditions).forEach((f) => set.add(f))
      if (r.exceptions) Object.keys(r.exceptions).forEach((f) => set.add(f))
    }
    return Array.from(set) as FieldPath<TFieldValues>[]
  }, [allRules])

  const tick = useWatch<TFieldValues>({
    control,
    name: fieldsToWatch,
    disabled: fieldsToWatch.length === 0,
  })

  // === Оптимизация: считаем только кандидатов через дерево scoped ===
  const prevActiveRef = useRef<ActiveRulesState<string>>({})
  const activeRules = useMemo<ActiveRulesState<string>>(() => {
    void tick
    const values = getValues()

    // 1) выберем кандидатов
    const pairs =
      selectCandidatesFromTree(
        sections as unknown as DynamicSectionsConfig<string>,
        values as Record<string, unknown>,
        (k, v) => (valueNormalizer ? valueNormalizer(k, v) : v),
      ) ?? null

    const candidateIdxs = pairs
      ? pairs
          .map(({ section, indexInSection }) => {
            const off = sectionToOffsets.get(section)
            return typeof off === 'number' ? off + indexInSection : -1
          })
          .filter((i) => i >= 0)
      : // если меты нет — проверяем всё, как раньше
        allRules.map((_r, i) => i)

    // 2) по умолчанию все false, а считаем только кандидатов
    const next: ActiveRulesState<string> = {}
    for (const r of allRules) next[r.id] = false
    for (const i of candidateIdxs) {
      const r = allRules[i]
      next[r.id] = checkConditions(values, r, {
        normalize: valueNormalizer,
        tag: 'DynamicFieldsContext',
      })
    }

    // 3) мемо: если не изменилось — вернём предыдущее
    const prev = prevActiveRef.current
    let changed = Object.keys(prev).length !== Object.keys(next).length
    if (!changed)
      for (const k in next)
        if (prev[k] !== next[k]) {
          changed = true
          break
        }
    if (!changed) return prev
    prevActiveRef.current = next
    return next
  }, [tick, allRules, getValues, valueNormalizer, sections, sectionToOffsets])

  // === Остальной код провайдера (reset/clearErrors/trigger) без изменений ===

  const prevResetRef = useRef<ActiveRulesState<string>>({})
  useEffect(() => {
    logger.debug('[DynamicFields] activeRules changed', activeRules)
    const prev = prevResetRef.current

    const keysRequiredByActive = new Set<string>()
    for (let i = 0; i < allRules.length; i++) {
      if (!activeRules[allRules[i].id]) continue
      for (const k of ruleIdxToKeys[i]) keysRequiredByActive.add(k)
    }

    for (let i = 0; i < allRules.length; i++) {
      const id = allRules[i].id
      const was = prev[id]
      const now = activeRules[id]
      if (was && !now) {
        for (const name of ruleIdxToKeys[i] as FieldPath<TFieldValues>[]) {
          if (!keysRequiredByActive.has(String(name))) {
            resetField(name, {
              keepError: !clearErrorsForUnrequired,
              keepDirty: false,
              keepTouched: false,
            })
            if (clearErrorsForUnrequired) clearErrors(name)
          }
        }
      }
    }
    prevResetRef.current = activeRules
  }, [activeRules, allRules, resetField, clearErrors, clearErrorsForUnrequired, ruleIdxToKeys])

  const prevToggleRef = useRef<ActiveRulesState<string>>({})
  useEffect(() => {
    const prev = prevToggleRef.current
    const toggledRuleIndexes: number[] = []
    for (let i = 0; i < allRules.length; i++) {
      const id = allRules[i].id
      if (prev[id] !== undefined && prev[id] !== activeRules[id]) toggledRuleIndexes.push(i)
    }
    prevToggleRef.current = activeRules
    if (toggledRuleIndexes.length === 0) return

    const names = new Set<string>()
    for (const idx of toggledRuleIndexes) for (const k of ruleIdxToKeys[idx]) names.add(k)
    let fieldsToRevalidate = Array.from(names) as FieldPath<TFieldValues>[]

    if (validationMode === 'onSubmit' && !formState.isSubmitted) return

    if (validationMode === 'onBlur' || validationMode === 'onTouched') {
      fieldsToRevalidate = fieldsToRevalidate.filter((name) => {
        const st = getFieldState(name, formState)
        return st.isTouched || !!st.error || formState.isSubmitted
      })
    }

    if (fieldsToRevalidate.length === 0) return
    void trigger(fieldsToRevalidate, { shouldFocus: false })
  }, [activeRules, allRules, ruleIdxToKeys, validationMode, formState, trigger, getFieldState])

  const meta = useMemo(
    () =>
      ({ sections, options, responseData, valueNormalizer, basePickParse }) as DynamicMeta<
        TOptions,
        TResponseData,
        SectionKey
      >,
    [sections, options, responseData, valueNormalizer, basePickParse],
  )

  return (
    <DynamicMetaContext.Provider value={meta}>
      <ActiveRulesContext.Provider value={activeRules}>{children}</ActiveRulesContext.Provider>
    </DynamicMetaContext.Provider>
  )
})

// eslint-disable-next-line react-refresh/only-export-components
export function useActiveRules() {
  const v = useContext(ActiveRulesContext)
  if (!v) throw new Error('useActiveRules must be used within a DynamicFieldsProvider')
  return v
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDynamicMeta<
  TOptions extends object = Record<string, never>,
  TResponseData = unknown,
  SectionKey extends string = string,
>() {
  const v = useContext(DynamicMetaContext)
  if (!v) throw new Error('useDynamicMeta must be used within a DynamicFieldsProvider')
  return v as DynamicMeta<TOptions, TResponseData, SectionKey>
}
