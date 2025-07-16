import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import type { AddressOperationRequest } from '@/entities/admin/address/types/request.dto'
import type { ContactOperationRequest } from '@/entities/admin/contact/types/request.dto'
import PeopleForm, { type PeopleFormInitialData } from '@/entities/admin/people/forms/form'
import type { PeopleFormFields } from '@/entities/admin/people/forms/schema'
import { personQueryKeys } from '@/entities/admin/people/services/keys'
import { personService } from '@/entities/admin/people/services/service'
import type { PersonUpdateRequest } from '@/entities/admin/people/types/request.dto'
import type { PersonDetailResponse } from '@/entities/admin/people/types/response.dto'
import { createArrayOperations, getLegacySingleObjectOperation } from '@/shared/lib/form-utils'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'

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

  // Запрос на обновление
  const handleSubmit = async (formData: PeopleFormFields) => {
    if (!data) {
      return
    }
    const payload: PersonUpdateRequest = {
      ...formData,
    }

    ;[payload.employeeProfileAction, payload.employeeProfileData] = getLegacySingleObjectOperation(
      data.employeeProfile,
      formData.employeeProfile,
    )

    payload.contactOperations = createArrayOperations(
      data.contacts,
      formData.contacts,
    ) as ContactOperationRequest[]

    payload.addressOperations = createArrayOperations(
      data.addresses,
      formData.addresses,
    ) as AddressOperationRequest[]

    await personService.update(id!, payload)
    navigate('..')
    return payload
  }

  // Адаптируем данные с запроса под форму
  function mapResponseToInitialData(obj: PersonDetailResponse): PeopleFormInitialData {
    const orgIds = obj.organizations.map((org) => org.id)
    const posIds = obj.positions.map((pos) => pos.id)

    return {
      defaultValues: {
        ...obj,
        organizationIds: orgIds.length > 0 ? (orgIds as [string, ...string[]]) : undefined,
        positionIds: posIds.length > 0 ? (posIds as [string, ...string[]]) : undefined,
        addresses:
          obj.addresses?.map((addr) => ({
            ...addr,
            cityId: addr.cityId,
          })) || [],
      },
      options: {
        organizations: obj.organizations.map((org) => ({
          value: org.id,
          label: org.legalName,
        })),
      },
    }
  }

  return (
    <>
      {isError && <AlertMessage type={AlertType.ERROR} message={queryError?.message} />}

      {!isLoading && !isError && data && (
        <div className="flex flex-wrap gap-x-2 gap-y-2">
          <div className="w-full">
            <PeopleForm
              onSubmit={handleSubmit}
              initialData={mapResponseToInitialData(data)}
              submitBtnName="Оновити"
            />
          </div>
        </div>
      )}
    </>
  )
}
