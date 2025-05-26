import { useNavigate, useSearchParams } from "react-router-dom"
import { ArrowLeft, Plus } from "lucide-react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import Button from "../../../../components/Button/Button"
import { DataTable } from "../../../../components/Table/DataTable"
import { adminPeopleColumns } from "./columns"
import type { PeopleListResponse } from "../../../../features/admin/people/types"
import { peopleService } from "../../../../features/admin/people/services/service"

export default function AdminPeopleList() {
  // Состояние из URL
  const [searchParams, setSearchParams] = useSearchParams()
  const pageFromUrl = Number(searchParams.get("page")) || 1
  const rawPerPageFromUrl = Number(searchParams.get("perPage")) || 10
  const perPageFromUrl = rawPerPageFromUrl > 20 ? 20 : rawPerPageFromUrl

  const navigate = useNavigate()

  // Получение данных, usersData
  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<PeopleListResponse, Error>({
    queryKey: ["adminPeopleData", pageFromUrl, perPageFromUrl],
    queryFn: () => {
      return peopleService.getList({
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
        <Button
          className="flex items-center justify-center gap-1 whitespace-nowrap"
          onClick={() => navigate("add")}
        >
          <Plus className="w-5 h-5" /> <span>Додати</span>
        </Button>
      </div>

      {isError && (
        <p className="text-red-600">Помилка: {queryError?.message}</p>
      )}

      {!isLoading && !isError && data && (
        <DataTable
          data={data?.people ?? []}
          columns={adminPeopleColumns}
          setSearchParams={setSearchParams}
          page={pageFromUrl}
          perPage={perPageFromUrl}
          totalPages={data?.totalPages}
        />
      )}
    </>
  )
}
