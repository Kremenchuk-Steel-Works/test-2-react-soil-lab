import Button from '@/shared/ui/button/Button'
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import type { PositionsFormFields } from '@/entities/admin/positions/forms/schema'
import PositionsForm from '@/entities/admin/positions/forms/form'
import { positionService } from '@/entities/admin/positions/services/service'

export default function AdminPositionsAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: PositionsFormFields) => {
    await positionService.create(data)
    navigate("..")
    return data
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <Button
          className="flex items-center justify-center gap-1 whitespace-nowrap"
          onClick={() => navigate("..")}
        >
          <ArrowLeft className="w-5 h-5" /> <span>Назад</span>
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
