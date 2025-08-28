import { useNavigate } from 'react-router-dom'
import MoldPassportCreate from '@/features/soil-lab/mold-passport/create/ui/MoldPassportCreate'

export default function MoldPassportAdd() {
  const navigate = useNavigate()

  const onSuccess = async () => {
    navigate('..')
  }

  return (
    <div className="flex flex-wrap gap-x-2 gap-y-2">
      <div className="w-full">
        <MoldPassportCreate onSuccess={onSuccess} />
      </div>
    </div>
  )
}
