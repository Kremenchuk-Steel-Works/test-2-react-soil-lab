import { useNavigate } from 'react-router-dom'
import PeopleForm from '@/entities/admin/people/forms/form'
import { type PeopleFormFields } from '@/entities/admin/people/forms/schema'
import { personService } from '@/entities/admin/people/services/service'

export default function AdminPeopleAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: PeopleFormFields) => {
    await personService.create(data)
    navigate('..')
    return data
  }

  return (
    <>
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        <div className="w-full">
          <PeopleForm onSubmit={handleSubmit} submitBtnName="Додати" />
        </div>
      </div>
    </>
  )
}
