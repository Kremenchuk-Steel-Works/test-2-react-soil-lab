import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

export const useUrlPagination = (defaultPerPage = 10, maxPerPage = 20) => {
  const [searchParams, setSearchParams] = useSearchParams()

  // Синхронно получаем параметры
  const page = Math.max(Number(searchParams.get('page')) || 1, 1)
  const rawPerPage = Number(searchParams.get('perPage')) || defaultPerPage
  const perPage = Math.min(rawPerPage, maxPerPage)

  // Эффект для формирования URL.
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams)
    let updated = false

    if (!searchParams.has('page')) {
      newParams.set('page', String(page))
      updated = true
    }
    if (!searchParams.has('perPage')) {
      newParams.set('perPage', String(perPage))
      updated = true
    }

    // Обновляем URL только если он действительно был неполным.
    if (updated) {
      setSearchParams(newParams, { replace: true })
    }
  }, [page, perPage, searchParams, setSearchParams])

  return {
    page,
    perPage,
    setSearchParams,
  }
}
