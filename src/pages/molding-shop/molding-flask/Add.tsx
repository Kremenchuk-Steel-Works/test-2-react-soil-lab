import { useNavigate } from 'react-router-dom'
import {
  MoldingFlaskForm,
  type MoldingFlaskFormFields,
} from '@/entities/molding-shop/molding-flask'

export default function MoldingFlaskAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: MoldingFlaskFormFields) => {
    // await personService.create(data)
    navigate('..')
    return data
  }

  return (
    <>
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        <div className="w-full">
          <MoldingFlaskForm onSubmit={handleSubmit} submitBtnName="Додати" />
        </div>
      </div>
    </>
  )
}
