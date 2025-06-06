// import { apiUsersAdd } from "../../services/user"
// import UserForm, {
//   userSchemaOld,
//   type UserFormFieldsOld,
// } from "../../components/Forms/UserForm"
// import { useRef } from "react"
// import { useQueryClient } from "@tanstack/react-query"

// interface PageProps {
//   onSuccess: () => void
// }

// export default function AdminUsersAddOld({ onSuccess }: PageProps) {
//   const formRef = useRef<{ reset: () => void }>(null)
//   const queryClient = useQueryClient()

//   const handleRefresh = () => {
//     queryClient.invalidateQueries({ queryKey: ["usersData"] })
//   }

//   const handleSubmit = async (data: UserFormFieldsOld) => {
//     await apiUsersAdd({
//       email: data.email,
//       rawPassword: data.rawPassword!,
//       profile: data.profile,
//     })
//     handleRefresh()
//     onSuccess()
//     formRef.current?.reset()
//   }

//   return (
//     <>
//       <div className="flex flex-wrap gap-x-2 gap-y-2">
//         <div className="w-full">
//           <UserForm
//             ref={formRef}
//             schema={userSchemaOld}
//             onSubmit={handleSubmit}
//             submitBtnName="Додати"
//           />
//         </div>
//       </div>
//     </>
//   )
// }
