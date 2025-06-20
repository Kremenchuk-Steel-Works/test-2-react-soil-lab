import Button from '@/shared/ui/button/Button'
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Pen } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { userService } from '@/entities/admin/users/services/service'
import type { UserDetailResponse } from '@/entities/admin/users/types/response.dto'
import { userQueryKeys } from '@/entities/admin/users/services/keys'
import AlertMessage, {
  AlertType,
} from '@/shared/ui/alert-message/AlertMessage'

export default function AdminUsersDetails() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<UserDetailResponse, Error>({
    queryKey: userQueryKeys.detail(id!),
    queryFn: () => userService.getById(id!),
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

              {data.email && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                    Email
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                    {data.email}
                  </dd>
                </div>
              )}

              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Status
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                  {data.isActive ? "Активний" : "Неактивний"}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Superuser
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                  {data.isSuperuser ? "Так" : "Ні"}
                </dd>
              </div>

              {data.lastLoginAt && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                    Останній вхід
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                    {new Date(data.lastLoginAt).toLocaleString()}
                  </dd>
                </div>
              )}

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

              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Ролі
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                  {data.roles.length > 0
                    ? data.roles.map((r) => r.name).join(", ")
                    : "—"}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-slate-400">
                  Дозволи
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-slate-300">
                  {data.permissions.length > 0
                    ? data.permissions.map((p) => p.name).join(", ")
                    : "—"}
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

              {/* <BottomSheetButton
                label={
                  <>
                    <Pen className="w-5 h-5" /> <span>Редагувати</span>
                  </>
                }
                buttonProps={{
                  customColor: "orange",
                  className:
                    "flex items-center justify-center gap-1 whitespace-nowrap",
                }}
                sheetProps={{
                  className: "h-full",
                  label: <p className="text-lg font-semibold">Користувач</p>,
                }}
              >
                {({ onSuccess }) => <AdminUsersUpdate2 onSuccess={onSuccess} />}
              </BottomSheetButton> */}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
