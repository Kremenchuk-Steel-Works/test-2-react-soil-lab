import { useNavigate, useParams } from 'react-router-dom'
import MoldPassportDelete from '@/features/soil-lab/mold-passport/delete/ui/MoldPassportDelete'

export default function MoldPassportDeletePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const onSuccess = async () => {
    navigate('..')
  }

  return id && <MoldPassportDelete id={id} onSuccess={onSuccess} />
}
