import { useNavigate } from 'react-router-dom'
import {
  CastingTechnologyForm,
  type CastingTechnologyFormFields,
} from '@/entities/molding-shop/casting-technology'

export default function CastingTechnologyAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: CastingTechnologyFormFields) => {
    // await personService.create(data)
    navigate('..')
    return data
  }

  return (
    <>
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        <div className="w-full">
          <CastingTechnologyForm onSubmit={handleSubmit} submitBtnName="Додати" />
        </div>
      </div>
    </>
  )
}
