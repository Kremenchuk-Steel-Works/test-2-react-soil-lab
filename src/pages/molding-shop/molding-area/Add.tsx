import { useNavigate } from 'react-router-dom'
import MoldingAreaForm from '@/entities/molding-shop/molding-area/ui/MoldingAreaForm/MoldingAreaForm'
import type { MoldingAreaFormFields } from '@/entities/molding-shop/molding-area/ui/MoldingAreaForm/schema'

export default function MoldingAreaAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: MoldingAreaFormFields) => {
    // await personService.create(data)
    navigate('..')
    return data
  }

  return (
    <>
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        <div className="w-full">
          <MoldingAreaForm onSubmit={handleSubmit} submitBtnName="Додати" />
        </div>
      </div>
    </>
  )
}
