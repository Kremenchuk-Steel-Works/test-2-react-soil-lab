import { useNavigate } from 'react-router-dom'
import {
  CastingProductForm,
  type CastingProductFormFields,
} from '@/entities/molding-shop/casting-product'

export default function CastingProductAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: CastingProductFormFields) => {
    // await personService.create(data)
    navigate('..')
    return data
  }

  return (
    <>
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        <div className="w-full">
          <CastingProductForm onSubmit={handleSubmit} submitBtnName="Додати" />
        </div>
      </div>
    </>
  )
}
