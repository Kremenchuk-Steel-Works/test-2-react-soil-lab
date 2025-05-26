import { useNavigate, useSearchParams, useResolvedPath } from "react-router-dom"
import { ArrowLeft, Plus } from "lucide-react"
import type { UsersData } from "../../../types/user"
import { apiUsers } from "../../../services/user"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import Button from "../../../components/Button/Button"
import { adminUsersColumns } from "./columns"
import { DataTable } from "../../../components/Table/DataTable"
import { useUserPermissionsTo } from "../../../hooks/usePermissions"

export default function LibraryList() {
  // Состояние из URL
  const [searchParams, setSearchParams] = useSearchParams()
  const pageFromUrl = Number(searchParams.get("page")) || 1
  const rawPerPageFromUrl = Number(searchParams.get("perPage")) || 10
  const perPageFromUrl = rawPerPageFromUrl > 20 ? 20 : rawPerPageFromUrl

  const navigate = useNavigate()
  const hasAccessToPath = useUserPermissionsTo()

  // Получение данных, usersData
  const {
    data: usersData,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<UsersData, Error>({
    queryKey: ["usersData", pageFromUrl, perPageFromUrl],
    queryFn: () => {
      return apiUsers({
        page: pageFromUrl,
        perPage: perPageFromUrl,
      })
    },
    placeholderData: keepPreviousData,
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
        {hasAccessToPath(useResolvedPath("add").pathname) && (
          <Button
            className="flex items-center justify-center gap-1 whitespace-nowrap"
            onClick={() => navigate("add")}
          >
            <Plus className="w-5 h-5" /> <span>Додати</span>
          </Button>
        )}
      </div>

      {isError && (
        <p className="text-red-600">Помилка: {queryError?.message}</p>
      )}

      {!isLoading && !isError && usersData && (
        <DataTable
          data={usersData?.users ?? []}
          columns={adminUsersColumns}
          setSearchParams={setSearchParams}
          page={pageFromUrl}
          perPage={perPageFromUrl}
          totalPages={usersData?.total_pages}
        />
      )}
    </>
  )
}
