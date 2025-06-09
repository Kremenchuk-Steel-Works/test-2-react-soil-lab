import { type PeopleFormFields } from "../../../features/admin/people/forms/schema"
import PeopleForm from "../../../features/admin/people/forms/form"
import { useNavigate } from "react-router-dom"
import Button from "../../../components/Button/Button"
import { ArrowLeft } from "lucide-react"
import { peopleService } from "../../../features/admin/people/services/service"

export default function AdminPeopleAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: PeopleFormFields) => {
    await peopleService.create(data)
    navigate("..")
    return data
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <Button
          className="flex items-center justify-center gap-1 whitespace-nowrap"
          onClick={() => navigate("..")}
        >
          <ArrowLeft className="w-5 h-5" /> <span>Назад</span>
        </Button>
      </div>

      <div className="flex flex-wrap gap-x-2 gap-y-2">
        <div className="w-full">
          <PeopleForm onSubmit={handleSubmit} submitBtnName="Додати" />
        </div>
      </div>
    </>
  )
}
