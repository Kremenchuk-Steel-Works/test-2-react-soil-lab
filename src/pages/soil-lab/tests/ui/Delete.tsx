import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TestsDelete from '@/features/soil-lab/tests/delete/ui/TestsDelete'

export default function TestsDeletePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const onSuccess = useCallback(() => {
    void navigate('../..')
  }, [navigate])

  return id && <TestsDelete id={id} onSuccess={onSuccess} />
}
