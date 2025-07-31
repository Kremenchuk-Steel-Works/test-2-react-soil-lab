import { useNavigate } from 'react-router-dom'
import {
  MoldExperimentForm,
  type MoldExperimentFormFields,
} from '@/entities/molding-shop/mold-experiment'

export default function MoldExperimentAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: MoldExperimentFormFields) => {
    // await personService.create(data)
    navigate('..')
    return data
  }

  return (
    <>
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        <div className="w-full">
          <MoldExperimentForm onSubmit={handleSubmit} submitBtnName="Додати" />
        </div>
      </div>
    </>
  )
}
