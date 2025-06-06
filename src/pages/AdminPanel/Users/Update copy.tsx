// import { useParams } from "react-router-dom"
// import { useQuery } from "@tanstack/react-query"
// import {
//   userUpdateSchema,
//   type UserUpdateFormFields,
// } from "../../../features/admin/users/forms/schema"
// import type { UserDetailResponse } from "../../../features/admin/users/types/response.dto"
// import { usersService } from "../../../features/admin/users/services/service"
// import UsersForm from "../../../features/admin/users/forms/form"
// import { useRef } from "react"

// interface PageProps {
//   onSuccess: () => void
// }

// export default function AdminUsersUpdate2({ onSuccess }: PageProps) {
//   const formRef = useRef<{ reset: () => void }>(null)
//   const { id } = useParams<{ id: string }>()

//   const {
//     data,
//     isLoading,
//     isError,
//     error: queryError,
//   } = useQuery<UserDetailResponse, Error>({
//     queryKey: ["adminUserData", id],
//     queryFn: () => usersService.getById(id!),
//     enabled: !!id,
//   })

//   const handleSubmit = async (data: UserUpdateFormFields) => {
//     // await apiPeopleAdd()
//     onSuccess()
//     formRef.current?.reset()
//     return data
//   }

//   return (
//     <>
//       {isError && (
//         <p className="text-red-600">Помилка: {queryError?.message}</p>
//       )}
//       {!isLoading && !isError && data && (
//         <div className="flex flex-wrap gap-x-2 gap-y-2">
//           <div className="w-full">
//             <UsersForm
//               ref={formRef}
//               schema={userUpdateSchema}
//               onSubmit={handleSubmit}
//               defaultValues={data}
//               submitBtnName="Оновити"
//             />
//           </div>
//         </div>
//       )}
//     </>
//   )
// }
