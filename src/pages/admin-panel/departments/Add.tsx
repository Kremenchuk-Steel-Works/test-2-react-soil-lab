import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import DepartmentsForm from '@/entities/admin-old/departments/forms/form'
import type { DepartmentsFormFields } from '@/entities/admin-old/departments/forms/schema'
import { departmentService } from '@/entities/admin-old/departments/services/service'

export default function AdminDepartmentsAdd() {
  const navigate = useNavigate()

  const handleSubmit = useCallback(
    async (data: DepartmentsFormFields): Promise<void> => {
      await departmentService.create(data)
      await navigate('..')
    },
    [navigate],
  )

  return (
    <>
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        <div className="w-full">
          <DepartmentsForm onSubmit={handleSubmit} submitBtnName="Додати" />
        </div>
      </div>
    </>
  )
}
