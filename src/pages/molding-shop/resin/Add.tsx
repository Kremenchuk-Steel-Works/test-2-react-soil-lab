import { useNavigate } from 'react-router-dom'
import { ResinForm, type ResinFormFields } from '@/entities/molding-shop/resin'

export default function ResinAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: ResinFormFields) => {
    // await personService.create(data)
    navigate('..')
    return data
  }

  return (
    <>
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        <div className="w-full">
          <ResinForm onSubmit={handleSubmit} submitBtnName="Додати" />
        </div>
      </div>
    </>
  )
}
