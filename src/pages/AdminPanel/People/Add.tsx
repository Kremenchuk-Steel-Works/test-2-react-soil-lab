import Button from "../../../components/Button/Button"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import PeopleForm, {
  type PeopleFormFields,
} from "../../../features/people/Forms/PeopleForm"
import { peopleSchema } from "../../../features/people/Forms/schema"

export default function AdminPeopleAdd() {
  const navigate = useNavigate()

  const handleSubmit = async (data: PeopleFormFields) => {
    // await apiPeopleAdd()
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
          <PeopleForm
            schema={peopleSchema}
            onSubmit={handleSubmit}
            submitBtnName="Додати"
          />
        </div>
      </div>
    </>
  )
}
