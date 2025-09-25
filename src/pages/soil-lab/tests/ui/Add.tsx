import { useNavigate, useParams } from 'react-router-dom'
import TestsCreate from '@/features/soil-lab/tests/create/ui/TestsCreate'
import { TestType } from '@/shared/api/soil-lab-2/model'

export default function TestsAddPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const onSuccess = () => {
    void navigate('..')
  }

  return (
    <div className="flex flex-wrap gap-x-2 gap-y-2">
      <div className="w-full">
        {id && <TestsCreate id={id} type={TestType.moisture_percent} onSuccess={onSuccess} />}
      </div>
      <div className="w-full">
        {id && <TestsCreate id={id} type={TestType.strength} onSuccess={onSuccess} />}
      </div>
      <div className="w-full">
        {id && <TestsCreate id={id} type={TestType.gas_permeability} onSuccess={onSuccess} />}
      </div>
    </div>
  )
}
