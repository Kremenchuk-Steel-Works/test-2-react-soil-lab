import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import MoistureCreate from '@/features/soil-lab/experiments/moisture/create/ui/MoistureCreate'

export default function MoistureAdd() {
  const navigate = useNavigate()

  const onSuccess = useCallback(() => {
    void navigate('..')
  }, [navigate])

  return (
    <div className="flex flex-wrap gap-x-2 gap-y-2">
      <div className="w-full">
        <MoistureCreate onSuccess={onSuccess} />
      </div>
    </div>
  )
}
