import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import SamplesCreate from '@/features/soil-lab/samples/create/ui/SamplesCreate'

export default function SamplesAdd() {
  const navigate = useNavigate()

  const onSuccess = useCallback(() => {
    void navigate('..')
  }, [navigate])

  return (
    <div className="flex flex-wrap gap-x-2 gap-y-2">
      <div className="w-full">
        <SamplesCreate onSuccess={onSuccess} />
      </div>
    </div>
  )
}
