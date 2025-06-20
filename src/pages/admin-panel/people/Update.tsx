import Button from '@/shared/ui/button/Button'
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { personService } from '@/entities/admin/people/services/service'
import PeopleForm from '@/entities/admin/people/forms/form'
import type { PeopleFormFields } from '@/entities/admin/people/forms/schema'
import type { PersonDetailResponse } from '@/entities/admin/people/types/response.dto'
import AlertMessage, {
  AlertType,
} from '@/shared/ui/alert-message/AlertMessage'
import { personQueryKeys } from '@/entities/admin/people/services/keys'
import type { PersonUpdateRequest } from '@/entities/admin/people/types/request.dto'
import {
  createArrayOperations,
  getLegacySingleObjectOperation,
} from '@/shared/lib/form-utils'
import type { ContactOperationRequest } from '@/entities/admin/contact/types/request.dto'
import type { AddressOperationRequest } from '@/entities/admin/address/types/request.dto'

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

  const handleSubmit = async (formData: PeopleFormFields) => {
    if (!data) {
      return
    }
    const payload: PersonUpdateRequest = {
      ...formData,
    }

    ;[payload.employeeProfileAction, payload.employeeProfileData] =
      getLegacySingleObjectOperation(
        data.employeeProfile,
        formData.employeeProfile
      )

    payload.contactOperations = createArrayOperations(
      data.contacts,
      formData.contacts
    ) as ContactOperationRequest[]

    payload.addressOperations = createArrayOperations(
      data.addresses,
      formData.addresses
    ) as AddressOperationRequest[]

    await personService.update(id!, payload)
    navigate("..")
    return payload
  }

  // Адаптируем данные под форму
  function mapToFormDefaults(
    obj: PersonDetailResponse
  ): Partial<PeopleFormFields> {
    const orgIds = obj.organizations.map((org) => org.id)
    const posIds = obj.positions.map((pos) => pos.id)

    return {
      ...obj,
      organizationIds:
        orgIds.length > 0 ? (orgIds as [string, ...string[]]) : undefined,
      positionIds:
        posIds.length > 0 ? (posIds as [string, ...string[]]) : undefined,
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
