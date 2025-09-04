import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MoldPassportDelete from '@/features/molding-shop-update/mold-passport/delete/ui/MoldPassportDelete'

export default function MoldPassportDeletePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const onSuccess = useCallback(() => {
    void navigate('..')
  }, [navigate])

  return id && <MoldPassportDelete id={id} onSuccess={onSuccess} />
}
