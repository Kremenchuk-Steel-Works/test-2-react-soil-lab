import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import type { AddressOperationRequest } from '@/entities/admin/address/types/request.dto'
import type { ContactOperationRequest } from '@/entities/admin/contact/types/request.dto'
import OrganizationsForm from '@/entities/admin/organizations/forms/form'
import type { OrganizationsFormFields } from '@/entities/admin/organizations/forms/schema'
import { organizationQueryKeys } from '@/entities/admin/organizations/services/keys'
import { organizationService } from '@/entities/admin/organizations/services/service'
import type { OrganizationUpdateRequest } from '@/entities/admin/organizations/types/request.dto'
import type { OrganizationDetailResponse } from '@/entities/admin/organizations/types/response.dto'
import { createArrayOperations } from '@/shared/lib/form-utils'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'

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

  const handleSubmit = async (formData: OrganizationsFormFields) => {
    if (!data) {
      return
    }

    // Адаптируем данные с запроса под форму
    const originalAddresses = data.addresses.map((addr) => ({
      ...addr,
      cityId: addr.city.id,
    }))

    const payload: OrganizationUpdateRequest = {
      ...formData,
    }

    payload.contactOperations = createArrayOperations(
      data.contacts,
      formData.contacts,
    ) as ContactOperationRequest[]

    payload.addressOperations = createArrayOperations(
      originalAddresses,
      formData.addresses,
    ) as AddressOperationRequest[]

    await organizationService.update(id!, payload)
    await navigate('..')
    return payload
  }

  // Адаптируем данные под форму
  function mapToFormDefaults(obj: OrganizationDetailResponse): Partial<OrganizationsFormFields> {
    return {
      ...obj,
      countryId: obj.country?.id,
      addresses:
        obj.addresses?.map((addr) => ({
          ...addr,
          cityId: addr.city.id,
        })) || [],
    }
  }

  return (
    <>
      {isError && <AlertMessage type={AlertType.ERROR} message={queryError?.message} />}

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
