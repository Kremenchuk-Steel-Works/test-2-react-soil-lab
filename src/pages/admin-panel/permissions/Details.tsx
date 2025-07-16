import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { permissionQueryKeys } from '@/entities/admin/permissions/services/keys'
import { permissionService } from '@/entities/admin/permissions/services/service'
import type { PermissionDetailResponse } from '@/entities/admin/permissions/types/response.dto'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'

export default function AdminPermissionsDetails() {
  const { id } = useParams<{ id: string }>()

  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<PermissionDetailResponse, Error>({
    queryKey: permissionQueryKeys.detail(id!),
    queryFn: () => permissionService.getById(id!),
    enabled: !!id,
  })

  return (
    <>
      {isError && <AlertMessage type={AlertType.ERROR} message={queryError?.message} />}

      {!isLoading && !isError && data && (
        <div className="bg-white p-6 dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">Деталі</h2>

          <dl className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">ID</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">{data.id}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Назва</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">{data.name}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Опис</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                {data.description || '—'}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Відділ ID</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                {data.department.id}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                Відділ Назва
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                {data.department.name}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">Відділ Опис</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                {data.department.description || '—'}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                Дата створення
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                {new Date(data.createdAt).toLocaleString()}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                Дата оновлення
              </dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                {new Date(data.updatedAt).toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </>
  )
}
