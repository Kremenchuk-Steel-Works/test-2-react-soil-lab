// import { useNavigate } from "react-router-dom"
// import { ArrowLeft, Plus } from "lucide-react"
// import { apiUsers } from "../../../services/user"
// import { keepPreviousData, useQuery } from "@tanstack/react-query"
// import Button from "../../../components/Button/Button"
// import { adminUsersColumnsOld } from "./columns"
// import { DataTable } from "../../../components/Table/DataTable"
// import type { UsersData } from "../../../types/user"
// import BottomSheetButton from "../../../components/ui/FilterButton/BottomSheetButton"
// import AdminUsersAddOld from "../Add"
// import { usePaginationParams } from "../../../hooks/usePaginationParams"

// export default function AdminUsersListOld() {
//   // Состояние из URL
//   const { page, perPage, setSearchParams } = usePaginationParams()
//   const navigate = useNavigate()

//   // Получение данных, usersData
//   const {
//     data: usersData,
//     isLoading,
//     isError,
//     error: queryError,
//   } = useQuery<UsersData, Error>({
//     queryKey: ["usersData", page, perPage],
//     queryFn: () => {
//       return apiUsers({
//         page: page,
//         perPage: perPage,
//       })
//     },
//     placeholderData: keepPreviousData,
//   })

//   return (
//     <>
//       <div className="flex justify-between items-center">
//         <Button
//           className="flex items-center justify-center gap-1 whitespace-nowrap"
//           onClick={() => navigate("..")}
//         >
//           <ArrowLeft className="w-5 h-5" /> <span>Назад</span>
//         </Button>
//         <BottomSheetButton
//           label={
//             <>
//               <Plus className="w-5 h-5" /> <span>Додати</span>
//             </>
//           }
//           buttonProps={{
//             className:
//               "flex items-center justify-center gap-1 whitespace-nowrap",
//           }}
//           sheetProps={{
//             className: "h-full",
//             label: <p className="text-lg font-semibold">Користувач</p>,
//           }}
//         >
//           {({ onSuccess }) => <AdminUsersAddOld onSuccess={onSuccess} />}
//         </BottomSheetButton>
//       </div>

//       {isError && (
//         <p className="text-red-600">Помилка: {queryError?.message}</p>
//       )}

//       {!isLoading && !isError && usersData && (
//         <DataTable
//           data={usersData?.users ?? []}
//           columns={adminUsersColumnsOld}
//           setSearchParams={setSearchParams}
//           page={page}
//           perPage={perPage}
//           totalPages={usersData?.totalPages}
//         />
//       )}
//     </>
//   )
// }
