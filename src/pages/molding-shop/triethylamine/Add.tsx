import { useNavigate } from 'react-router-dom'
import {
  TriethylamineForm,
  type TriethylamineFormFields,
} from '@/entities/molding-shop/triethylamine'

export default function TriethylamineAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: TriethylamineFormFields) => {
    // await personService.create(data)
    navigate('..')
    return data
  }

  return (
    <>
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        <div className="w-full">
          <TriethylamineForm onSubmit={handleSubmit} submitBtnName="Додати" />
        </div>
      </div>
    </>
  )
}
