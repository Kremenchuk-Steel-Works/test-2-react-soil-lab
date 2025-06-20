import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PositionsForm from '@/entities/admin/positions/forms/form'
import type { PositionsFormFields } from '@/entities/admin/positions/forms/schema'
import { positionService } from '@/entities/admin/positions/services/service'
import Button from '@/shared/ui/button/Button'

export default function AdminPositionsAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: PositionsFormFields) => {
    await positionService.create(data)
    navigate('..')
    return data
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Button
          className="flex items-center justify-center gap-1 whitespace-nowrap"
          onClick={() => navigate('..')}
        >
          <ArrowLeft className="h-5 w-5" /> <span>Назад</span>
        </Button>
      </div>

      <div className="flex flex-wrap gap-x-2 gap-y-2">
        <div className="w-full">
          <PositionsForm onSubmit={handleSubmit} submitBtnName="Додати" />
        </div>
      </div>
    </>
  )
}
