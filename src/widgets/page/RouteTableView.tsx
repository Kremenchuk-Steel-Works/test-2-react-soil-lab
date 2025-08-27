import { useMemo } from 'react'
import { createColumnHelper } from '@tanstack/react-table'
import { Link } from 'react-router-dom'
import { APP_ROUTES } from '@/app/routes/routes'
import type { AppRoute } from '@/app/routes/types'
import { findRouteByKey } from '@/utils/routes/routeUtils'
import { SimpleClientTable } from '@/widgets/data-table/SimpleClientTable'

type RouteTableViewProps = {
  parentRouteKey: string
}

const ensureAbs = (p: string) => (p.startsWith('/') ? p : `/${p}`)

export function RouteTableView({ parentRouteKey }: RouteTableViewProps) {
  const parentRoute = findRouteByKey(APP_ROUTES, parentRouteKey)

  // Получаем дочерние роуты, которые мы хотим отобразить
  const routeData = useMemo(
    () =>
      parentRoute?.children?.filter((child) => child.children && child.children.length > 0) ?? [],
    [parentRoute],
  )

  // Определяем колонки для таблицы
  const columnHelper = createColumnHelper<AppRoute>()

  const columns = [
    columnHelper.accessor('label', {
      header: 'Назва',
      cell: ({ row }) => {
        const to = ensureAbs(row.original.path)
        return (
          <Link to={to} title={row.original.label} onClick={(e) => e.stopPropagation()}>
            {row.original.label}
          </Link>
        )
      },
    }),
  ]

  if (!routeData.length) {
    return <p>Не існує розділів</p>
  }

  return <SimpleClientTable data={routeData} columns={columns} />
}
