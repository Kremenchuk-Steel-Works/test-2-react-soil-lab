import { useNavigate, useParams } from 'react-router-dom'
import MeasurementsUpdate from '@/features/soil-lab/measurements/update/ui/MeasurementsUpdate'

export default function MeasurementsUpdatePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const onSuccess = () => {
    void navigate('..')
  }

  return (
    <div className="flex flex-wrap gap-x-2 gap-y-2">
      <div className="w-full">{id && <MeasurementsUpdate id={id} onSuccess={onSuccess} />}</div>
    </div>
  )
}
