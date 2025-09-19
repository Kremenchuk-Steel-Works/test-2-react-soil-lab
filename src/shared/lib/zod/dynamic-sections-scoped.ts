import { type ZodObject, type ZodRawShape } from 'zod'
import {
  ANY_VALUE,
  createSectionsConfig,
  type ConditionsMap,
  type DynamicRule,
  type DynamicSectionsConfig,
} from '@/shared/lib/zod/dynamic-sections'

export type ScopeNode = {
  id?: string
  conditions?: ConditionsMap
  exceptions?: ConditionsMap
  schema?: ZodObject<ZodRawShape>
  Component?: DynamicRule['Component']
  schemaStrategy?: 'override' | 'merge'
  children?: ReadonlyArray<ScopeNode>
}

export type ScopedSections<S extends string = string> = Readonly<
  Record<S, ReadonlyArray<ScopeNode>>
>

/** Метадерево (WeakMap) — не мутируем объект секций */
type CompiledTreeNode = {
  conditions?: ConditionsMap
  exceptions?: ConditionsMap
  /** индекс правила внутри своей секции (после компиляции scoped → flat) */
  ruleIndexInSection?: number
  children?: ReadonlyArray<CompiledTreeNode>
}
type TreeMeta = {
  bySection: { readonly [section: string]: ReadonlyArray<CompiledTreeNode> }
}

const META = new WeakMap<DynamicSectionsConfig<string>, TreeMeta>()

export function getScopedTreeMeta(sections: DynamicSectionsConfig<string>): TreeMeta | undefined {
  return META.get(sections)
}

function attachTreeMeta<S extends string>(
  sections: DynamicSectionsConfig<S>,
  meta: TreeMeta,
): DynamicSectionsConfig<S> {
  const frozen: TreeMeta = {
    bySection: (() => {
      const out: Record<string, ReadonlyArray<CompiledTreeNode>> = {}
      for (const k in meta.bySection) {
        const arr = meta.bySection[k] ?? []
        out[k] = Object.freeze(arr.slice())
      }
      return Object.freeze(out)
    })(),
  }
  META.set(sections, frozen)
  return sections
}

// Утилиты сравнения условий

function isPresent(v: unknown) {
  return v !== null && v !== undefined && v !== ''
}

function valueMatches(
  formValueRaw: unknown,
  cond: unknown,
  key: string,
  normalize: (k: string, v: unknown) => unknown,
  form: Record<string, unknown>,
): boolean {
  const formValue = normalize(key, formValueRaw)

  if (typeof cond === 'function') {
    if (formValue === '' || formValue === undefined || formValue === null) return false
    return (cond as (v: unknown, ctx: { form: Record<string, unknown> }) => boolean)(formValue, {
      form,
    })
  }

  if (cond === ANY_VALUE || (Array.isArray(cond) && (cond as unknown[]).includes(ANY_VALUE))) {
    return isPresent(formValue)
  }

  if (Array.isArray(cond)) {
    const normalized = (cond as unknown[]).map((x) => normalize(key, x))
    return normalized.some((x) => Object.is(x, formValue))
  }

  const rhs = normalize(key, cond)
  return Object.is(formValue, rhs)
}

function nodeMatches(
  form: Record<string, unknown>,
  node: { conditions?: ConditionsMap; exceptions?: ConditionsMap },
  normalize: (k: string, v: unknown) => unknown,
): boolean {
  const { conditions, exceptions } = node
  if (conditions) {
    for (const k in conditions) {
      if (!valueMatches(form[k], conditions[k], k, normalize, form)) return false
    }
  }
  if (exceptions) {
    for (const k in exceptions) {
      if (valueMatches(form[k], exceptions[k], k, normalize, form)) return false
    }
  }
  return true
}

// Компиляция scoped → flat (+ метадерево)

export function createScopedSectionsConfig<S extends string>(
  scoped: ScopedSections<S>,
  opts?: { defaultSchemaStrategy?: 'override' | 'merge' },
): DynamicSectionsConfig<S> {
  const defaultSchemaStrategy = opts?.defaultSchemaStrategy ?? 'override'

  type Acc = {
    conditions?: ConditionsMap
    exceptions?: ConditionsMap
    schema?: ZodObject<ZodRawShape>
    Component?: DynamicRule['Component']
  }

  const temp: Partial<Record<S, Array<Omit<DynamicRule, 'id'>>>> = {}
  const perSectionTrees: Partial<Record<S, CompiledTreeNode[]>> = {}

  const pushRule = (sectionKey: S, r: Omit<DynamicRule, 'id'>): number => {
    const arr = (temp[sectionKey] ??= [])
    const idx = arr.length
    arr.push(r)
    return idx
  }

  const walkEmit = (section: S, acc: Acc, node: ScopeNode): CompiledTreeNode => {
    const nextCond = acc.conditions
      ? { ...acc.conditions, ...(node.conditions ?? {}) }
      : node.conditions
    const nextExc =
      acc.exceptions || node.exceptions
        ? { ...(acc.exceptions ?? {}), ...(node.exceptions ?? {}) }
        : undefined

    let nextSchema = acc.schema
    if (node.schema) {
      nextSchema =
        (node.schemaStrategy ?? defaultSchemaStrategy) === 'merge' && acc.schema
          ? (acc.schema.merge(node.schema) as ZodObject<ZodRawShape>)
          : node.schema
    }
    const nextComponent = node.Component ?? acc.Component

    let ruleIndexInSection: number | undefined
    if (nextSchema && nextComponent) {
      ruleIndexInSection = pushRule(section, {
        conditions: nextCond ?? {},
        exceptions: nextExc,
        schema: nextSchema,
        Component: nextComponent,
      })
    }

    const childrenNodes: CompiledTreeNode[] = []
    for (const child of node.children ?? []) {
      childrenNodes.push(
        walkEmit(
          section,
          {
            conditions: nextCond,
            exceptions: nextExc,
            schema: nextSchema,
            Component: nextComponent,
          },
          child,
        ),
      )
    }

    return {
      conditions: node.conditions,
      exceptions: node.exceptions,
      ruleIndexInSection,
      children: childrenNodes.length ? childrenNodes : undefined,
    }
  }

  for (const section in scoped) {
    const roots = scoped[section as S] ?? []
    const compiledRoots: CompiledTreeNode[] = []
    for (const root of roots) compiledRoots.push(walkEmit(section as S, {}, root))
    perSectionTrees[section as S] = compiledRoots
  }

  // Готовим input для createSectionsConfig
  const inputObj: Partial<Record<S, ReadonlyArray<Omit<DynamicRule, 'id'>>>> = {}
  for (const k in temp) {
    const arr = temp[k as S] ?? []
    inputObj[k as S] = arr.slice()
  }
  // cast нужен: из Partial → Readonly (createSectionsConfig требует полный словарь по ключам, но Partial допустим на практике)
  const input = inputObj as Readonly<Record<S, ReadonlyArray<Omit<DynamicRule, 'id'>>>>

  const flat = createSectionsConfig(input)

  const metaObj: Record<string, ReadonlyArray<CompiledTreeNode>> = {}
  for (const k in perSectionTrees) {
    const arr = perSectionTrees[k as S] ?? []
    metaObj[k] = arr.slice()
  }
  const meta: TreeMeta = { bySection: metaObj }

  return attachTreeMeta<S>(flat, meta)
}

// Быстрый выбор кандидатов по дереву

export function selectCandidatesFromTree(
  sections: DynamicSectionsConfig<string>,
  values: Record<string, unknown>,
  normalize: (k: string, v: unknown) => unknown,
): Array<{ section: string; indexInSection: number }> | null {
  const meta = getScopedTreeMeta(sections)
  if (!meta) return null

  const out: Array<{ section: string; indexInSection: number }> = []

  for (const section in meta.bySection) {
    const roots = meta.bySection[section] ?? []
    const stack: CompiledTreeNode[] = roots.slice().reverse()
    while (stack.length) {
      const node = stack.pop() as CompiledTreeNode
      if (!nodeMatches(values, node, normalize)) continue

      if (typeof node.ruleIndexInSection === 'number') {
        out.push({ section, indexInSection: node.ruleIndexInSection })
      }
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) stack.push(node.children[i])
      }
    }
  }

  return out
}

function cloneNodeWithOffset(node: CompiledTreeNode, off: number): CompiledTreeNode {
  return {
    conditions: node.conditions,
    exceptions: node.exceptions,
    ruleIndexInSection:
      typeof node.ruleIndexInSection === 'number' ? node.ruleIndexInSection + off : undefined,
    children: node.children?.map((c) => cloneNodeWithOffset(c, off)),
  }
}

// Вспомогательный тип: union ключей из DynamicSectionsConfig<...>
type SectionsKey<T> = T extends DynamicSectionsConfig<infer S> ? S : never

// Union-merge с сохранением меты и смещением индексов
export function mergeSections<T extends ReadonlyArray<DynamicSectionsConfig<string>>>(
  ...all: T
): DynamicSectionsConfig<SectionsKey<T[number]>> {
  type Rule = DynamicRule<object, unknown, string>

  // Аккумуляторы без any
  const out = new Map<string, Rule[]>()
  const mergedTrees = new Map<string, CompiledTreeNode[]>()

  for (const cfg of all) {
    for (const sectionKey of Object.keys(cfg)) {
      const src = (cfg[sectionKey] as ReadonlyArray<Rule> | undefined) ?? []
      const dst = out.get(sectionKey) ?? []
      const offset = dst.length

      // Перенумеровываем id в ИТОГОВОЙ секции → без коллизий
      for (let j = 0; j < src.length; j++) {
        const r = src[j]
        dst.push({ ...r, id: `${sectionKey}:${offset + j}` })
      }
      out.set(sectionKey, dst)

      // Переносим метадерево со смещением индексов
      const meta = getScopedTreeMeta(cfg)
      const roots = meta?.bySection?.[sectionKey] ?? []
      if (roots.length) {
        const dstRoots = mergedTrees.get(sectionKey) ?? []
        for (const n of roots) dstRoots.push(cloneNodeWithOffset(n, offset))
        mergedTrees.set(sectionKey, dstRoots)
      }
    }
  }

  // Иммутабельный объект секций: ReadonlyArray<Rule>
  const resultObj: Record<string, ReadonlyArray<Rule>> = {}
  for (const [k, v] of out) {
    resultObj[k] = Object.freeze(v.slice())
  }

  // Ключи динамические → осознанный cast через unknown
  const result = resultObj as unknown as DynamicSectionsConfig<SectionsKey<T[number]>>

  // Прикрепляем объединённую мету, если была
  if (all.some((c) => Boolean(getScopedTreeMeta(c)))) {
    const metaOut: Record<string, ReadonlyArray<CompiledTreeNode>> = {}
    for (const [k, arr] of mergedTrees) {
      metaOut[k] = Object.freeze(arr.slice())
    }
    return attachTreeMeta(result, { bySection: metaOut })
  }

  return result
}
