import { useNavigate, useParams } from 'react-router-dom'
import MoldPassportUpdate from '@/features/soil-lab/mold-passport/update/ui/MoldPassportUpdate'

export default function MoldPassportUpdatePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const onSuccess = () => {
    void navigate('..')
  }

  return (
    <div className="flex flex-wrap gap-x-2 gap-y-2">
      <div className="w-full">{id && <MoldPassportUpdate id={id} onSuccess={onSuccess} />}</div>
    </div>
  )
}
