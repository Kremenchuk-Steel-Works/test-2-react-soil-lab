import { useNavigate } from 'react-router-dom'
import PositionsForm from '@/entities/admin/positions/forms/form'
import type { PositionsFormFields } from '@/entities/admin/positions/forms/schema'
import { positionService } from '@/entities/admin/positions/services/service'

export default function AdminPositionsAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: PositionsFormFields) => {
    await positionService.create(data)
    navigate('..')
    return data
  }

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
