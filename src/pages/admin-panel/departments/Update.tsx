import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import DepartmentsForm from '@/entities/admin-old/departments/forms/form'
import type { DepartmentsFormFields } from '@/entities/admin-old/departments/forms/schema'
import { departmentQueryKeys } from '@/entities/admin-old/departments/services/keys'
import { departmentService } from '@/entities/admin-old/departments/services/service'
import type { DepartmentDetailResponse } from '@/entities/admin-old/departments/types/response.dto'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'

export default function AdminDepartmentsUpdate() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<DepartmentDetailResponse, Error>({
    queryKey: departmentQueryKeys.detail(id!),
    queryFn: () => departmentService.getById(id!),
    enabled: !!id,
  })

  const handleSubmit = useCallback(
    async (data: DepartmentsFormFields): Promise<void> => {
      await departmentService.update(id!, data)
      await navigate('..')
    },
    [navigate, id],
  )

  return (
    <>
      {isError && <AlertMessage type={AlertType.ERROR} message={queryError?.message} />}

      {!isLoading && !isError && data && (
        <div className="flex flex-wrap gap-x-2 gap-y-2">
          <div className="w-full">
            <DepartmentsForm onSubmit={handleSubmit} defaultValues={data} submitBtnName="Оновити" />
          </div>
        </div>
      )}
    </>
  )
}
