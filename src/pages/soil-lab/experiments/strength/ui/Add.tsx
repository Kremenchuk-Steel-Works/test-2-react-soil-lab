import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import StrengthCreate from '@/features/soil-lab/experiments/strength/create/ui/StrengthCreate'

export default function StrengthAdd() {
  const navigate = useNavigate()

  const onSuccess = useCallback(() => {
    void navigate('..')
  }, [navigate])

  return (
    <div className="flex flex-wrap gap-x-2 gap-y-2">
      <div className="w-full">
        <StrengthCreate onSuccess={onSuccess} />
      </div>
    </div>
  )
}
