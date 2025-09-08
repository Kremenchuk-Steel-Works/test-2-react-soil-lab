import type { ReactNode } from 'react'
import type { CellContext, ColumnDef } from '@tanstack/react-table'
import { Link } from 'react-router-dom'

type LinkColumnOptions<TData, TValue extends string | number> = {
  /** Кастомный href. Если не задан — href = String(getValue()). */
  getHref?: (ctx: CellContext<TData, TValue>) => string | null | undefined
  /** Кастомная метка. Если не задана — метка = значение ячейки. */
  getLabel?: (ctx: CellContext<TData, TValue>) => ReactNode
  /** Что показать, если ссылку/метку построить нельзя. */
  fallback?: ReactNode
}

/**
 * Колонка-ссылка.
 * Без options: ссылка и текст = значение ячейки.
 * С options.getHref: ссылка строится по записи (например, по id), текст — как раньше (или getLabel).
 */
export function linkColumn<TData, TValue extends string | number = string | number>(
  options?: LinkColumnOptions<TData, TValue>,
): Pick<ColumnDef<TData, TValue>, 'cell'> {
  const fallbackNode = options?.fallback ?? '—'

  return {
    cell: (ctx) => {
      const raw = ctx.getValue()
      const rawStr = raw == null ? '' : String(raw)

      // href: либо кастомный, либо значение ячейки
      const href = options?.getHref?.(ctx) ?? rawStr

      // label: либо кастомная, либо значение ячейки
      const label = options?.getLabel?.(ctx) ?? (rawStr ? rawStr : null)

      // Если href пуст или нет метки — показываем fallback (чтобы не рендерить пустую ссылку)
      if (!href || !label) return fallbackNode

      return (
        <Link className="text-blue-600 hover:underline" to={href}>
          {label}
        </Link>
      )
    },
  }
}
