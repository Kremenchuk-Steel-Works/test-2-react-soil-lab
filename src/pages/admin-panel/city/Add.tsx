import Button from "../../../shared/ui/button123/Button"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import type { CityFormFields } from "../../../entities/admin/city/forms/schema"
import CityForm from "../../../entities/admin/city/forms/form"
import { cityService } from "../../../entities/admin/city/services/service"

export default function AdminCityAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: CityFormFields) => {
    await cityService.create(data)
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
          <CityForm onSubmit={handleSubmit} submitBtnName="Додати" />
        </div>
      </div>
    </>
  )
}
