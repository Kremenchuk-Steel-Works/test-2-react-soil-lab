import { useNavigate } from 'react-router-dom'
import {
  MoldCoreTypeForm,
  type MoldCoreTypeFormFields,
} from '@/entities/molding-shop/mold-core-type'

export default function MoldCoreTypeAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: MoldCoreTypeFormFields) => {
    // await personService.create(data)
    navigate('..')
    return data
  }

  return (
    <>
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        <div className="w-full">
          <MoldCoreTypeForm onSubmit={handleSubmit} submitBtnName="Додати" />
        </div>
      </div>
    </>
  )
}
