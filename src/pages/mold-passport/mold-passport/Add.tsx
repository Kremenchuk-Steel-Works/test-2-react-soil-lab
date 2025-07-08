import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { personService } from '@/entities/admin/people/services/service'
import MoldPassportForm from '@/entities/mold-passport/mold-passport/forms/form'
import type { MoldPassportFormFields } from '@/entities/mold-passport/mold-passport/forms/schema'
import Button from '@/shared/ui/button/Button'

export default function MoldPassportAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: MoldPassportFormFields) => {
    await personService.create(data)
    navigate('..')
    return data
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Button
          className="flex items-center justify-center gap-1 whitespace-nowrap"
          onClick={() => navigate('..')}
        >
          <ArrowLeft className="h-5 w-5" /> <span>Назад</span>
        </Button>
      </div>

      <div className="flex flex-wrap gap-x-2 gap-y-2">
        <div className="w-full">
          <MoldPassportForm onSubmit={handleSubmit} submitBtnName="Додати" />
        </div>
      </div>
    </>
  )
}
