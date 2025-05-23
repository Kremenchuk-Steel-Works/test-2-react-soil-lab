import Button from "../../../components/Button/Button"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import type { Organization } from "../../../features/organizations/types"
import { organizationsService } from "../../../features/organizations/services/service"
import type { OrganizationsFormFields } from "../../../features/organizations/forms/schema"
import OrganizationsForm from "../../../features/organizations/forms/form"

export default function AdminOrganizationsUpdate() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const {
    data: person,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<Organization, Error>({
    queryKey: ["adminOrganizationData", id],
    queryFn: () => organizationsService.getById(id!),
    enabled: !!id,
  })

  const handleSubmit = async (data: OrganizationsFormFields) => {
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

      {isError && (
        <p className="text-red-600">Помилка: {queryError?.message}</p>
      )}
      {!isLoading && !isError && person && (
        <div className="flex flex-wrap gap-x-2 gap-y-2">
          <div className="w-full">
            <OrganizationsForm
              onSubmit={handleSubmit}
              defaultValues={person}
              submitBtnName="Оновити"
            />
          </div>
        </div>
      )}
    </>
  )
}
