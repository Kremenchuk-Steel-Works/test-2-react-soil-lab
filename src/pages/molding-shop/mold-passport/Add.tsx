import { useNavigate } from 'react-router-dom'
import {
  MoldPassportForm,
  moldPassportFormDefaultValues,
  moldPassportService,
  type MoldPassportFormFields,
} from '@/entities/molding-shop/mold-passport'

export default function MoldPassportAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: MoldPassportFormFields) => {
    await moldPassportService.create(data)
    navigate('..')
    return data
  }

  return (
    <>
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        <div className="w-full">
          <MoldPassportForm
            defaultValues={moldPassportFormDefaultValues}
            onSubmit={handleSubmit}
            submitBtnName="Додати"
          />
        </div>
      </div>
    </>
  )
}
