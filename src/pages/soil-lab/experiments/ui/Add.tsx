import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ExperimentsCreateForm } from '@/features/soil-lab/experiments/ui/ExperimentsCreateForm'

export default function ExperimentsAdd() {
  const navigate = useNavigate()

  const onSuccess = useCallback(() => {
    void navigate('..')
  }, [navigate])

  return (
    <div className="flex flex-wrap gap-x-2 gap-y-2">
      <div className="w-full">
        <ExperimentsCreateForm submitBtnName="Додати" onSubmit={onSuccess} />
      </div>
    </div>
  )
}
