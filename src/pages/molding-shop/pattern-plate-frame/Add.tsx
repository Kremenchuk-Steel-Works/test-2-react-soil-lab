import { useNavigate } from 'react-router-dom'
import {
  PatternPlateFrameForm,
  type PatternPlateFrameFormFields,
} from '@/entities/molding-shop/pattern-plate-frame'

export default function PatternPlateFrameAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: PatternPlateFrameFormFields) => {
    // await personService.create(data)
    navigate('..')
    return data
  }

  return (
    <>
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        <div className="w-full">
          <PatternPlateFrameForm onSubmit={handleSubmit} submitBtnName="Додати" />
        </div>
      </div>
    </>
  )
}
