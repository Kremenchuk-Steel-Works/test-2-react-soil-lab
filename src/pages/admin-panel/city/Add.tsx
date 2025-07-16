import { useNavigate } from 'react-router-dom'
import CityForm from '@/entities/admin/city/forms/form'
import type { CityFormFields } from '@/entities/admin/city/forms/schema'
import { cityService } from '@/entities/admin/city/services/service'

export default function AdminCityAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: CityFormFields) => {
    await cityService.create(data)
    navigate('..')
    return data
  }

  return (
    <>
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        <div className="w-full">
          <CityForm onSubmit={handleSubmit} submitBtnName="Додати" />
        </div>
      </div>
    </>
  )
}
