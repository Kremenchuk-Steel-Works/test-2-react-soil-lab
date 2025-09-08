import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MeasurementsDelete from '@/features/soil-lab/measurements/delete/ui/MeasurementsDelete'

export default function MeasurementsDeletePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const onSuccess = useCallback(() => {
    void navigate('../..')
  }, [navigate])

  return id && <MeasurementsDelete id={id} onSuccess={onSuccess} />
}
