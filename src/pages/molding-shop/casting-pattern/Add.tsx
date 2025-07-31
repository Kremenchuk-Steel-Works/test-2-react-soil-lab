import { useNavigate } from 'react-router-dom'
import {
  CastingPatternForm,
  type CastingPatternFormFields,
} from '@/entities/molding-shop/casting-pattern'

export default function CastingPatternAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: CastingPatternFormFields) => {
    // await personService.create(data)
    navigate('..')
    return data
  }

  return (
    <>
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        <div className="w-full">
          <CastingPatternForm onSubmit={handleSubmit} submitBtnName="Додати" />
        </div>
      </div>
    </>
  )
}
