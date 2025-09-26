import { isValidElement, type ReactNode } from 'react'
import type { CellContext, ColumnDef } from '@tanstack/react-table'
import { Link, type LinkProps } from 'react-router-dom'

export type LinkWrapOptions<TData, TValue> = {
  getHref: (ctx: CellContext<TData, TValue>) => string | null | undefined
  fallback?: ReactNode
  getLinkProps?: (ctx: CellContext<TData, TValue>) => Omit<LinkProps, 'to' | 'children'>
  className?: string
  linkWhen?: (ctx: CellContext<TData, TValue>) => boolean
}

/* ========= Перегрузки ========= */
export function linkColumn<TData, TValue>(): Pick<ColumnDef<TData, TValue>, 'cell' | 'filterFn'>
export function linkColumn<TData, TValue>(
  base: Pick<ColumnDef<TData, TValue>, 'cell' | 'filterFn'>,
  options: LinkWrapOptions<TData, TValue>,
): Pick<ColumnDef<TData, TValue>, 'cell' | 'filterFn'>
export function linkColumn<TData, TValue>(
  options: LinkWrapOptions<TData, TValue>,
): Pick<ColumnDef<TData, TValue>, 'cell' | 'filterFn'>

/* ========= Реализация ========= */
export function linkColumn<TData, TValue>(
  baseOrOptions?:
    | Pick<ColumnDef<TData, TValue>, 'cell' | 'filterFn'>
    | LinkWrapOptions<TData, TValue>,
  maybeOptions?: LinkWrapOptions<TData, TValue>,
): Pick<ColumnDef<TData, TValue>, 'cell' | 'filterFn'> {
  const basePassed = isBaseDef(baseOrOptions)

  // Явное приведение к <TData, TValue>, чтобы не утянуть unknown-дженерики из тайпгарда
  const base: Pick<ColumnDef<TData, TValue>, 'cell' | 'filterFn'> = basePassed
    ? (baseOrOptions as Pick<ColumnDef<TData, TValue>, 'cell' | 'filterFn'>)
    : {
        // дефолтная "база": рендерим сырое значение
        cell: (ctx: CellContext<TData, TValue>) => toNode(ctx.getValue() as unknown) ?? '—',
      }

  const rawOptions = (basePassed ? maybeOptions : baseOrOptions) as
    | LinkWrapOptions<TData, TValue>
    | undefined

  // Дефолтный getHref: ссылка = значение ячейки
  const defaultGetHref = (ctx: CellContext<TData, TValue>): string | null => {
    const v = ctx.getValue() as unknown
    if (typeof v === 'string' || typeof v === 'number' || typeof v === 'bigint') return String(v)
    return null
  }

  const options: LinkWrapOptions<TData, TValue> = rawOptions ?? {
    getHref: defaultGetHref,
  }

  const { fallback = '—', getLinkProps, className, linkWhen } = options

  const cell: NonNullable<ColumnDef<TData, TValue>['cell']> = (ctx) => {
    // Получаем отформатированный контент из базы
    const rawContent: unknown =
      typeof base.cell === 'function'
        ? (base.cell as (c: CellContext<TData, TValue>) => unknown)(ctx)
        : (ctx.getValue() as unknown)

    const content: ReactNode = toNode(rawContent) ?? fallback

    // Решаем, будет ли ссылка
    const maybeHref = options.getHref(ctx)
    const hasRawValue = hasValue(ctx.getValue())
    const allowedByPredicate = linkWhen ? linkWhen(ctx) : hasRawValue

    if (typeof maybeHref !== 'string' || maybeHref.length === 0 || !allowedByPredicate) {
      return content
    }

    const extra = getLinkProps?.(ctx)
    const mergedClassName = ['text-blue-600 hover:underline', extra?.className, className]
      .filter((x): x is string => Boolean(x))
      .join(' ')

    return (
      <Link {...extra} className={mergedClassName} to={maybeHref}>
        {content}
      </Link>
    )
  }

  return { ...base, cell }
}

/* ========= Утилиты ========= */

function isBaseDef(x: unknown): x is Pick<ColumnDef<unknown, unknown>, 'cell' | 'filterFn'> {
  if (x == null || typeof x !== 'object') return false
  const obj = x as Partial<ColumnDef<unknown, unknown>>
  return 'cell' in obj || 'filterFn' in obj
}

function hasValue(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0
  return value !== null && value !== undefined && value !== ''
}

/** Приводит неизвестное значение к ReactNode без базовой строковой интерполяции. */
function toNode(value: unknown): ReactNode {
  if (value == null) return null

  const t = typeof value
  if (t === 'string' || t === 'number' || t === 'bigint') return value as ReactNode
  if (t === 'boolean') return value ? 'true' : 'false'
  if (isValidElement(value)) return value
  if (Array.isArray(value)) return value as unknown as ReactNode

  if (value instanceof Date) return value.toISOString()

  if (t === 'object') {
    const obj = value as { toString?: () => unknown }
    const toStringFn = obj.toString
    if (typeof toStringFn === 'function' && toStringFn !== Object.prototype.toString) {
      const str = toStringFn.call(obj)
      if (typeof str === 'string' && str.length > 0) return str
    }
    return null
  }

  return null
}
