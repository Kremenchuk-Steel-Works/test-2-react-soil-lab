import { useParams } from 'react-router-dom'
import MoldPassportUpdate from '@/features/soil-lab/mold-passport/MoldPassportUpdate'

export default function MoldPassportUpdatePage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="flex flex-wrap gap-x-2 gap-y-2">
      <div className="w-full">{id && <MoldPassportUpdate id={id} />}</div>
    </div>
  )
}
