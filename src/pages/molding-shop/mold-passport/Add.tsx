import { useNavigate } from 'react-router-dom'
import { personService } from '@/entities/admin/people/services/service'
import MoldPassportForm from '@/entities/molding-shop/mold-passport/ui/MoldPassportForm/MoldPassportForm'
import type { MoldPassportFormFields } from '@/entities/molding-shop/mold-passport/ui/MoldPassportForm/schema'

export default function MoldPassportAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: MoldPassportFormFields) => {
    // await personService.create(data)
    // navigate('..')
    // return data
  }

  return (
    <>
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        <div className="w-full">
          <MoldPassportForm onSubmit={handleSubmit} submitBtnName="Додати" />
        </div>
      </div>
    </>
  )
}
