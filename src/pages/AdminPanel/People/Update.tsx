import Button from "../../../components/Button/Button"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { peopleService } from "../../../features/admin/people/services/service"
import PeopleForm from "../../../features/admin/people/forms/form"
import type { PeopleFormFields } from "../../../features/admin/people/forms/schema"
import type { PersonDetailResponse } from "../../../features/admin/people/types/response.dto"

export default function AdminPeopleUpdate() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<PersonDetailResponse, Error>({
    queryKey: ["adminPersonData", id],
    queryFn: () => peopleService.getById(id!),
    enabled: !!id,
  })

  const handleSubmit = async (data: PeopleFormFields) => {
    // await apiPeopleAdd()
    navigate("..")
    return data
  }

  // Адаптируем данные под форму
  function mapPersonToFormDefaults(
    person: PersonDetailResponse
  ): Partial<PeopleFormFields> {
    return {
      ...person,
      organizationIds: person.organizations?.map((org) => org.id) || [],
      positionIds: person.positions?.map((pos) => pos.id) || [],
    }
  }
  const modifiedData = data ? mapPersonToFormDefaults(data) : undefined
  console.log("123", modifiedData)

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

      {isError && (
        <p className="text-red-600">Помилка: {queryError?.message}</p>
      )}
      {!isLoading && !isError && data && (
        <div className="flex flex-wrap gap-x-2 gap-y-2">
          <div className="w-full">
            <PeopleForm
              onSubmit={handleSubmit}
              defaultValues={modifiedData}
              submitBtnName="Оновити"
            />
          </div>
        </div>
      )}
    </>
  )
}
