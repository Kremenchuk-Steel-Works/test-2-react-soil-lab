import Button from "../../components/Button/Button"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, Plus } from "lucide-react"
import type { UsersData } from "../../types/User"
import { apiUsers } from "../../services/user"
import { useQuery } from "@tanstack/react-query"

export default function AdminUsersList() {
  const navigate = useNavigate()

  const {
    data,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<UsersData, Error>({
    queryKey: ["usersData"],
    queryFn: apiUsers,
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

      <div>
        {isError && (
          <p className="text-red-600">Помилка: {queryError?.message}</p>
        )}
        {!isLoading && !isError && data && (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-spacing-0 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Full Name</th>
                  <th className="px-4 py-2 text-left">No.</th>
                  <th className="px-4 py-2 text-left">Roles</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    <td className="px-4 py-2">
                      <Link className="text-blue-500" to={user.id.toString()}>
                        {user.id}
                      </Link>
                    </td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">
                      {user.profile.first_name + " " + user.profile.last_name}
                    </td>
                    <td className="px-4 py-2">
                      {user.profile.employee_number}
                    </td>
                    <td className="px-4 py-2">
                      {user.roles.map((r) => r.name).join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
