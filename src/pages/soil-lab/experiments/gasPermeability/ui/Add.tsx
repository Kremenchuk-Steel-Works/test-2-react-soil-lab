import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import GasPermeabilityCreate from '@/features/soil-lab/experiments/gasPermeability/create/ui/GasPermeabilityCreate'

export default function GasPermeabilityAdd() {
  const navigate = useNavigate()

  const onSuccess = useCallback(() => {
    void navigate('..')
  }, [navigate])

  return (
    <div className="flex flex-wrap gap-x-2 gap-y-2">
      <div className="w-full">
        <GasPermeabilityCreate onSuccess={onSuccess} />
      </div>
    </div>
  )
}
