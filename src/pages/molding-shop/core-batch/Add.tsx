import { useNavigate } from 'react-router-dom'
import { CoreBatchForm, type CoreBatchFormFields } from '@/entities/molding-shop/core-batch'

export default function CoreBatchAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: CoreBatchFormFields) => {
    // await personService.create(data)
    navigate('..')
    return data
  }

  return (
    <>
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        <div className="w-full">
          <CoreBatchForm onSubmit={handleSubmit} submitBtnName="Додати" />
        </div>
      </div>
    </>
  )
}
