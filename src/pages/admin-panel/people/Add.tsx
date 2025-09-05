import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import PeopleForm from '@/entities/admin-old/people/forms/form'
import { type PeopleFormFields } from '@/entities/admin-old/people/forms/schema'
import { personService } from '@/entities/admin-old/people/services/service'

export default function AdminPeopleAdd() {
  const navigate = useNavigate()

  const handleSubmit = useCallback(
    async (data: PeopleFormFields): Promise<void> => {
      await personService.create(data)
      await navigate('..')
    },
    [navigate],
  )

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
