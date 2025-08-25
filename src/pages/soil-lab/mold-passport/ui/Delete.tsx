import { useParams } from 'react-router-dom'
import MoldPassportDelete from '@/features/soil-lab/mold-passport/MoldPassportDelete'

export default function MoldPassportDeletePage() {
  const { id } = useParams<{ id: string }>()

  return id && <MoldPassportDelete id={id} />
}
