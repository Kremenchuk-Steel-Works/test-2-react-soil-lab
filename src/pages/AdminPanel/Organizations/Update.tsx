import Button from "../../../components/Button/Button"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { organizationService } from "../../../features/admin/organizations/services/service"
import type { OrganizationsFormFields } from "../../../features/admin/organizations/forms/schema"
import OrganizationsForm from "../../../features/admin/organizations/forms/form"
import type { OrganizationDetailResponse } from "../../../features/admin/organizations/types/response.dto"
import AlertMessage, { AlertType } from "../../../components/AlertMessage"
import { organizationQueryKeys } from "../../../features/admin/organizations/services/keys"

export default function AdminOrganizationsUpdate() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<OrganizationDetailResponse, Error>({
    queryKey: organizationQueryKeys.detail(id!),
    queryFn: () => organizationService.getById(id!),
    enabled: !!id,
  })

  const handleSubmit = async (data: OrganizationsFormFields) => {
    await organizationService.update(id!, data)
    navigate("..")
    return data
  }

  // Адаптируем данные под форму
  function mapToFormDefaults(
    obj: OrganizationDetailResponse
  ): Partial<OrganizationsFormFields> {
    return {
      ...obj,
      countryId: obj.country?.id,
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
            <OrganizationsForm
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
