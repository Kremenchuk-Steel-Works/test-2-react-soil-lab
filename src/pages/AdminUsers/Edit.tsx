// import Button from "../../components/Button/Button"
// import { useNavigate, useParams } from "react-router-dom"
// import { ArrowLeft } from "lucide-react"
// import { apiUsersDetail, apiUsersEdit } from "../../services/user"
// import { useQuery } from "@tanstack/react-query"
// import { z } from "zod"
// import type { User } from "../../types/user"
// import UserForm, { userSchemaOld } from "../../components/Forms/UserForm"

// // Создание новой схемы без поля raw_password
// export const userSchemaWithoutPassword = userSchemaOld.omit({
//   rawPassword: true,
// })
// export type UserFormFieldsWithoutPassword = z.infer<
//   typeof userSchemaWithoutPassword
// >

// export default function AdminUsersEditOld() {
//   const navigate = useNavigate()
//   const { id } = useParams<{ id: string }>()

//   const {
//     data: user,
//     isLoading,
//     isError,
//     error: queryError,
//   } = useQuery<User, Error>({
//     queryKey: ["userDetailsData", id],
//     queryFn: () => apiUsersDetail(id!),
//     enabled: !!id && /^\d+$/.test(id),
//   })

//   const handleSubmit = async (data: UserFormFieldsWithoutPassword) => {
//     await apiUsersEdit(id!, {
//       email: data.email,
//       profile: data.profile,
//     })
//     navigate("..")
//   }

//   return (
//     <>
//       <div className="flex justify-between items-center">
//         <Button
//           className="flex items-center justify-center gap-1 whitespace-nowrap"
//           onClick={() => navigate("..")}
//         >
//           <ArrowLeft className="w-5 h-5" /> <span>Назад</span>
//         </Button>
//       </div>

//       {isError && (
//         <p className="text-red-600">Помилка: {queryError?.message}</p>
//       )}
//       {!isLoading && !isError && user && (
//         <div className="flex flex-wrap gap-x-2 gap-y-2">
//           <div className="w-full">
//             <UserForm<UserFormFieldsWithoutPassword>
//               ref={null}
//               defaultValues={user}
//               onSubmit={handleSubmit}
//               submitBtnName="Змінити"
//               schema={userSchemaWithoutPassword}
//               showPasswordField={false}
//             />
//           </div>
//         </div>
//       )}
//     </>
//   )
// }
