import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import MoldPassportCreate from '@/features/molding-shop-update/mold-passport/create/ui/MoldPassportCreate'

export default function MoldPassportAdd() {
  const navigate = useNavigate()

  const onSuccess = useCallback(() => {
    void navigate('..')
  }, [navigate])

  return (
    <div className="flex flex-wrap gap-x-2 gap-y-2">
      <div className="w-full">
        <MoldPassportCreate onSuccess={onSuccess} />
      </div>
    </div>
  )
}
