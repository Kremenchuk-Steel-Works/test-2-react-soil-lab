import { useNavigate } from 'react-router-dom'
import LibraryForm from '@/entities/library/forms/form'
import type { LibraryFormFields } from '@/entities/library/forms/schema'

export default function LibraryAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: LibraryFormFields) => {
    // await personService.create(data)
    navigate('..')
    return data
  }

  return (
    <>
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        <div className="w-full">
          <LibraryForm onSubmit={handleSubmit} submitBtnName="Додати" />
        </div>
      </div>
    </>
  )
}
