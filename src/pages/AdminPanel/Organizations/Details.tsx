import Button from "../../../components/Button/Button"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Pen } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { organizationsService } from "../../../features/admin/organizations/services/service"
import type { OrganizationDetailResponse } from "../../../features/admin/organizations/types/response.dto"

export default function AdminOrganizationsDetails() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<OrganizationDetailResponse, Error>({
    queryKey: ["adminOrganizationData", id],
    queryFn: () => organizationsService.getById(id!),
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
          <p className="text-red-600">Помилка: {queryError?.message}</p>
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
                  {data.legalName}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Реєстраційний номер
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                  {data.registrationNumber}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Податковий номер
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                  {data.taxId}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Країна
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                  {data.country.name}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Email
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                  {data.contacts.find((c) => c.type === "email" && c.isPrimary)
                    ?.value || "—"}
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
