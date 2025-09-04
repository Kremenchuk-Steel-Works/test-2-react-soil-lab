import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import MeasurementsCreate from '@/features/soil-lab/measurements/create/ui/MeasurementsCreate'

export default function MeasurementsAdd() {
  const navigate = useNavigate()

  const onSuccess = useCallback(() => {
    void navigate('..')
  }, [navigate])

  return (
    <div className="flex flex-wrap gap-x-2 gap-y-2">
      <div className="w-full">
        <MeasurementsCreate onSuccess={onSuccess} />
      </div>
    </div>
  )
}
