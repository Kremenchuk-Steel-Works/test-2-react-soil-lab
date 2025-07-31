import { useNavigate } from 'react-router-dom'
import {
  CoreMakingMachineForm,
  type CoreMakingMachineFormFields,
} from '@/entities/molding-shop/core-making-machine'

export default function CoreMakingMachineAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: CoreMakingMachineFormFields) => {
    // await personService.create(data)
    navigate('..')
    return data
  }

  return (
    <>
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        <div className="w-full">
          <CoreMakingMachineForm onSubmit={handleSubmit} submitBtnName="Додати" />
        </div>
      </div>
    </>
  )
}
