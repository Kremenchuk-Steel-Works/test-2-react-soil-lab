import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import CountryForm from '@/entities/admin/country/forms/form'
import type { CountryFormFields } from '@/entities/admin/country/forms/schema'
import { countryService } from '@/entities/admin/country/services/service'
import Button from '@/shared/ui/button/Button'

export default function AdminCountryAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: CountryFormFields) => {
    await countryService.create(data)
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
          <CountryForm onSubmit={handleSubmit} submitBtnName="Додати" />
        </div>
      </div>
    </>
  )
}
