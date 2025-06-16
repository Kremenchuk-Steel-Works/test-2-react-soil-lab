import Button from "../../../components/Button/Button"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { personService } from "../../../features/admin/people/services/service"
import PeopleForm from "../../../features/admin/people/forms/form"
import type { PeopleFormFields } from "../../../features/admin/people/forms/schema"
import type { PersonDetailResponse } from "../../../features/admin/people/types/response.dto"
import AlertMessage, { AlertType } from "../../../components/AlertMessage"
import { personQueryKeys } from "../../../features/admin/people/services/keys"

export default function AdminPeopleUpdate() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<PersonDetailResponse, Error>({
    queryKey: personQueryKeys.detail(id!),
    queryFn: () => personService.getById(id!),
    enabled: !!id,
  })

  const handleSubmit = async (data: PeopleFormFields) => {
    await personService.update(id!, data)
    navigate("..")
    return data
  }

  // Адаптируем данные под форму
  function mapToFormDefaults(
    obj: PersonDetailResponse
  ): Partial<PeopleFormFields> {
    return {
      ...obj,
      organizationIds: obj.organizations?.map((org) => org.id) || [],
      positionIds: obj.positions?.map((pos) => pos.id) || [],
      addresses:
        obj.addresses?.map((addr) => ({
          ...addr,
          cityId: addr.cityId,
        })) || [],
    }
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

      {isError && (
        <AlertMessage type={AlertType.ERROR} message={queryError?.message} />
      )}

      {!isLoading && !isError && data && (
        <div className="flex flex-wrap gap-x-2 gap-y-2">
          <div className="w-full">
            <PeopleForm
              onSubmit={handleSubmit}
              defaultValues={mapToFormDefaults(data)}
              submitBtnName="Оновити"
            />
          </div>
        </div>
      )}
    </>
  )
}
