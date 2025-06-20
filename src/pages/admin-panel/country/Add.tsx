import Button from '@/shared/ui/button/Button'
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import type { CountryFormFields } from '@/entities/admin/country/forms/schema'
import CountryForm from '@/entities/admin/country/forms/form'
import { countryService } from '@/entities/admin/country/services/service'

export default function AdminCountryAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: CountryFormFields) => {
    await countryService.create(data)
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
          <CountryForm onSubmit={handleSubmit} submitBtnName="Додати" />
        </div>
      </div>
    </>
  )
}
