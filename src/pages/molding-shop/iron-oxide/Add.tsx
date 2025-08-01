import { useNavigate } from 'react-router-dom'
import { IronOxideForm, type IronOxideFormFields } from '@/entities/molding-shop/iron-oxide'

export default function IronOxideAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: IronOxideFormFields) => {
    // await personService.create(data)
    navigate('..')
    return data
  }

  return (
    <>
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        <div className="w-full">
          <IronOxideForm onSubmit={handleSubmit} submitBtnName="Додати" />
        </div>
      </div>
    </>
  )
}
