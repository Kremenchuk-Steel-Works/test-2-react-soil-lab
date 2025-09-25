import type { ReactNode } from 'react'
import type { ColumnDef, Row } from '@tanstack/react-table'
import { Link } from 'react-router-dom'
import { toLowerSafe } from '@/shared/lib/strings/toLowerSafe'
import { vf, type ValueFormatter } from './value-formatters'

type FieldFormatMap<TObj extends object> = {
  [K in keyof TObj]?: ValueFormatter<NonNullable<TObj[K]>>
}

export interface ObjectColumnOptions<TObj extends object> {
  pick?: ReadonlyArray<keyof TObj>
  labels?: Partial<Record<keyof TObj, string>>
  format?: FieldFormatMap<TObj>
  placeholder?: ReactNode
  layout?: 'inline' | 'stack'
  pairSeparator?: string
}

function isRenderablePrimitive(v: unknown): boolean {
  const t = typeof v
  return (
    v == null ||
    t === 'string' ||
    t === 'number' ||
    t === 'bigint' ||
    t === 'boolean' ||
    v instanceof Date
  )
}

function createObjectRenderer<TObj extends object>(opts?: {
  pick?: ReadonlyArray<keyof TObj>
  labels?: Partial<Record<keyof TObj, string>>
  format?: FieldFormatMap<TObj>
  pairSeparator?: string
}) {
  const { pick, labels, format, pairSeparator = ' • ' } = opts ?? {}

  const keysToShow = (obj: TObj) =>
    (pick ?? (Object.keys(obj) as (keyof TObj)[])).filter((k) => {
      if (format?.[k]) return true
      const v = (obj as Record<keyof TObj, unknown>)[k]
      return isRenderablePrimitive(v)
    })

  const pairs = (obj: TObj) =>
    keysToShow(obj).map((k) => {
      const fmt = (format?.[k] ?? vf.display()) as ValueFormatter<unknown>
      const value = (obj as Record<keyof TObj, unknown>)[k]
      return {
        label: String(labels?.[k] ?? (k as string)),
        node: fmt.render(value),
        text: fmt.toText(value),
      }
    })

  const renderInline = (obj: TObj): ReactNode => {
    const ps = pairs(obj).filter((p) => p.node != null && p.node !== '')
    return ps.map((p, i) => (
      // список статичен — индекс допустим
      <span key={i} className="whitespace-nowrap">
        <span className="text-muted-foreground">{p.label}:</span> {p.node}
        {i < ps.length - 1 ? pairSeparator : null}
      </span>
    ))
  }

  const renderStack = (obj: TObj): ReactNode => {
    const ps = pairs(obj).filter((p) => p.node != null && p.node !== '')
    return (
      <div className="flex flex-col gap-0.5">
        {ps.map((p, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-muted-foreground">{p.label}:</span>
            <span>{p.node}</span>
          </div>
        ))}
      </div>
    )
  }

  const toText = (obj: TObj): string =>
    pairs(obj)
      .map((p) => p.text)
      .join(' ')

  return { renderInline, renderStack, toText }
}

/** Рендер одного объекта (как у тебя было) — оставляем */
export function objectPropsColumn<TObj extends object, TData = unknown>(
  opts?: ObjectColumnOptions<TObj>,
): Pick<ColumnDef<TData, TObj | null | undefined>, 'cell' | 'filterFn'> {
  const { placeholder = '—', layout = 'stack', ...rest } = opts ?? {}
  const r = createObjectRenderer<TObj>(rest)

  return {
    cell: ({ getValue }) => {
      const obj = getValue()
      if (!obj || typeof obj !== 'object') return placeholder
      return layout === 'inline' ? r.renderInline(obj) : r.renderStack(obj)
    },
    filterFn: (row, columnId, filterValue) => {
      const obj = row.getValue<TObj | null | undefined>(columnId)
      if (!obj || typeof obj !== 'object') return false
      return toLowerSafe(r.toText(obj)).includes(toLowerSafe(filterValue))
    },
  }
}

/** СПИСОК объектов. ВАЖНО: первый дженерик — элемент (TItem), второй — тип строки (TData, выводится из контекста) */
export interface ObjectListColumnOptions<TItem extends object, TData> {
  pick?: ReadonlyArray<keyof TItem>
  labels?: Partial<Record<keyof TItem, string>>
  format?: FieldFormatMap<TItem>
  placeholder?: ReactNode
  layout?: 'inline' | 'stack'
  itemSeparator?: string
  limit?: number
  itemKey?: (args: { item: TItem; index: number; row: Row<TData> }) => string
  getItemHref?: (args: { item: TItem; index: number; row: Row<TData> }) => string | null | undefined
}

export function objectColumn<TItem extends object, TData = unknown>(
  opts?: ObjectListColumnOptions<TItem, TData>,
): Pick<ColumnDef<TData, ReadonlyArray<TItem>>, 'cell' | 'filterFn'> {
  const {
    placeholder = '—',
    layout = 'stack',
    itemSeparator = '; ',
    limit,
    itemKey,
    getItemHref,
    ...rest
  } = opts ?? {}

  const r = createObjectRenderer<TItem>(rest as ObjectColumnOptions<TItem>)

  return {
    cell: ({ getValue, row }) => {
      const list = getValue() // ReadonlyArray<TItem>
      if (list.length === 0) return placeholder

      const items = limit ? list.slice(0, limit) : list
      const restCount = limit ? list.length - limit : 0

      const nodes = items.map((it, idx) => {
        const key = itemKey ? itemKey({ item: it, index: idx, row }) : String(idx)
        const content = layout === 'inline' ? r.renderInline(it) : r.renderStack(it)
        const href = getItemHref?.({ item: it, index: idx, row })

        return (
          <span key={key} className="whitespace-nowrap">
            {typeof href === 'string' && href.length > 0 ? (
              <Link to={href}>{content}</Link>
            ) : (
              content
            )}
            {layout === 'inline' && idx < items.length - 1 ? itemSeparator : null}
          </span>
        )
      })

      return (
        <>
          {nodes}
          {restCount > 0 ? (
            <span>
              {layout === 'inline' ? itemSeparator : ' '}… (+{restCount})
            </span>
          ) : null}
        </>
      )
    },

    filterFn: (row, columnId, filterValue) => {
      const list = row.getValue<ReadonlyArray<TItem>>(columnId)
      if (list.length === 0) return false
      const haystack = toLowerSafe(list.map((it) => r.toText(it)).join(' | '))
      return haystack.includes(toLowerSafe(filterValue))
    },
  }
}

/** Опционально — «связка» для строгой типизации на таблицу */
export function bindObjectColumnsFor<TData>() {
  return {
    object: <TObj extends object>(opts?: ObjectColumnOptions<TObj>) =>
      objectPropsColumn<TObj, TData>(opts),

    list: <TItem extends object>(opts?: ObjectListColumnOptions<TItem, TData>) =>
      objectColumn<TItem, TData>(opts),
  }
}
