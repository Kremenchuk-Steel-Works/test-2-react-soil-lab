import { useNavigate } from 'react-router-dom'
import CountryForm from '@/entities/admin/country/forms/form'
import type { CountryFormFields } from '@/entities/admin/country/forms/schema'
import { countryService } from '@/entities/admin/country/services/service'

export default function AdminCountryAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: CountryFormFields) => {
    await countryService.create(data)
    navigate('..')
    return data
  }

  return (
    <>
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        <div className="w-full">
          <CountryForm onSubmit={handleSubmit} submitBtnName="Додати" />
        </div>
      </div>
    </>
  )
}
