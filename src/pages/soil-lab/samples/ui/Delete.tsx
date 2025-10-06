import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SamplesDelete from '@/features/soil-lab/samples/delete/ui/SamplesDelete'

export default function SamplesDeletePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const onSuccess = useCallback(() => {
    void navigate('..')
  }, [navigate])

  return id && <SamplesDelete id={id} onSuccess={onSuccess} />
}
