import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import PositionsForm from '@/entities/admin-old/positions/forms/form'
import type { PositionsFormFields } from '@/entities/admin-old/positions/forms/schema'
import { positionService } from '@/entities/admin-old/positions/services/service'

export default function AdminPositionsAdd() {
  const navigate = useNavigate()

  const handleSubmit = useCallback(
    async (data: PositionsFormFields): Promise<void> => {
      await positionService.create(data)
      await navigate('..')
    },
    [navigate],
  )

  return (
    <>
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        <div className="w-full">
          <PositionsForm onSubmit={handleSubmit} submitBtnName="Додати" />
        </div>
      </div>
    </>
  )
}
