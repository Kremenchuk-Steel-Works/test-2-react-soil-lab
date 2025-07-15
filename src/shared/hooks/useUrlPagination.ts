import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export const useUrlPagination = (maxPerPage = 20) => {
  const [searchParams, setSearchParams] = useSearchParams()

  // Парсим параметры из URL с дефолтными значениями
  const page = Math.max(Number(searchParams.get('page')) || 1, 1)
  const rawPerPage = Number(searchParams.get('perPage')) || 10
  const perPage = Math.min(rawPerPage, maxPerPage)

  // Добавляем флаг готовности. Изначально false.
  const [isReady, setIsReady] = useState(false)

  // Логика проверки и "очистки" URL
  useEffect(() => {
    const hasPage = searchParams.has('page')
    const hasPerPage = searchParams.has('perPage')

    if (!hasPage || !hasPerPage) {
      // Если URL неполный, исправляем его
      const newParams = new URLSearchParams(searchParams)
      newParams.set('page', String(page))
      newParams.set('perPage', String(perPage))

      setSearchParams(newParams, { replace: true })
      // Готовность будет выставлена на следующем рендере после исправления URL
    } else {
      // Если URL уже в порядке, сразу сообщаем, что все готово
      setIsReady(true)
    }
  }, [page, perPage, searchParams, setSearchParams])

  return {
    page,
    perPage,
    setSearchParams,
    isReady,
  }
}
