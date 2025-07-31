import { useNavigate } from 'react-router-dom'
import {
  MoldingSandTypeForm,
  type MoldingSandTypeFormFields,
} from '@/entities/molding-shop/molding-sand-type'

export default function MoldingSandTypeAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: MoldingSandTypeFormFields) => {
    // await personService.create(data)
    navigate('..')
    return data
  }

  return (
    <>
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        <div className="w-full">
          <MoldingSandTypeForm onSubmit={handleSubmit} submitBtnName="Додати" />
        </div>
      </div>
    </>
  )
}
