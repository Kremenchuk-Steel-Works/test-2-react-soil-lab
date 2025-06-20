import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import CityForm from '@/entities/admin/city/forms/form'
import type { CityFormFields } from '@/entities/admin/city/forms/schema'
import { cityService } from '@/entities/admin/city/services/service'
import Button from '@/shared/ui/button/Button'

export default function AdminCityAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: CityFormFields) => {
    await cityService.create(data)
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
          <CityForm onSubmit={handleSubmit} submitBtnName="Додати" />
        </div>
      </div>
    </>
  )
}
