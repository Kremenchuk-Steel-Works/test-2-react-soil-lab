import Button from "../../../shared/ui/button123/Button"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Pen } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { departmentService } from "../../../entities/admin/departments/services/service"
import type { DepartmentDetailResponse } from "../../../entities/admin/departments/types/response.dto"
import { departmentQueryKeys } from "../../../entities/admin/departments/services/keys"
import AlertMessage, {
  AlertType,
} from "../../../shared/ui/alert-message/AlertMessage"

export default function AdminDepartmentsDetails() {
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

      <div>
        {isError && (
          <AlertMessage type={AlertType.ERROR} message={queryError?.message} />
        )}

        {!isLoading && !isError && data && (
          <div className="bg-white dark:bg-gray-800 p-6">
            <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
              Деталі
            </h2>

            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  ID
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                  {data.id}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Назва
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                  {data.name}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Опис
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                  {data.description}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Створено
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                  {new Date(data.createdAt).toLocaleString()}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Оновлено
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                  {new Date(data.updatedAt).toLocaleString()}
                </dd>
              </div>

              <div className="md:col-span-2">
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Права доступу
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300 space-y-2">
                  {data.permissions?.map((perm, index) => (
                    <div key={index}>
                      <div className="font-medium">{perm.name}</div>
                      <div className="text-sm text-gray-500 dark:text-slate-400">
                        {perm.description}
                      </div>
                    </div>
                  ))}
                </dd>
              </div>
            </dl>

            <div className="flex justify-between items-center py-2">
              <Button
                className="flex items-center justify-center gap-1 whitespace-nowrap bg-orange-500 hover:bg-orange-600"
                onClick={() => navigate("update")}
              >
                <Pen className="w-5 h-5" /> <span>Редагувати</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
