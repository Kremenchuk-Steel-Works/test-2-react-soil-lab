import {
  userSchema,
  type UserFormFields,
} from "../../../features/admin/users/forms/schema"
import UsersForm from "../../../features/admin/users/forms/form"
import { useRef } from "react"

interface PageProps {
  onSuccess: () => void
}

export default function AdminUsersAdd2({ onSuccess }: PageProps) {
  const formRef = useRef<{ reset: () => void }>(null)

  const handleSubmit = async (data: UserFormFields) => {
    // await apiPeopleAdd()
    onSuccess()
    formRef.current?.reset()
    return data
  }

  return (
    <>
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        <div className="w-full">
          <UsersForm
            ref={formRef}
            schema={userSchema}
            onSubmit={handleSubmit}
            submitBtnName="Додати"
            defaultValues={{
              isActive: true,
              isSuperuser: false,
            }}
          />
        </div>
      </div>
    </>
  )
}
