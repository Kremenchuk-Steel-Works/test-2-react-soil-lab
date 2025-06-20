import { useSearchParams } from 'react-router-dom'

export const usePaginationParams = (maxPerPage = 20) => {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = Math.max(Number(searchParams.get('page')) || 1, 1)
  const rawPerPage = Number(searchParams.get('perPage')) || 10
  const perPage = Math.min(rawPerPage, maxPerPage)

  const setPage = (newPage: number) => {
    searchParams.set('page', String(newPage))
    setSearchParams(searchParams)
  }

  const setPerPage = (newPerPage: number) => {
    searchParams.set('perPage', String(newPerPage))
    setSearchParams(searchParams)
  }

  return { page, perPage, setPage, setPerPage, setSearchParams }
}
