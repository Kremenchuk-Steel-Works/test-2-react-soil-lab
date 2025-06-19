import { lazy } from "react"
import { Users, Database, CirclePlus, Info, RefreshCcw } from "lucide-react"
import type { AppRoute } from "../../../app/routes/routes.config"
import AdminUsersLayout from "../../../pages/admin-panel/users/Layout"

const AdminUsersList = lazy(
  () => import("../../../pages/admin-panel/users/list/List")
)
const AdminUsersAdd = lazy(() => import("../../../pages/admin-panel/users/Add"))
const AdminUsersDetails = lazy(
  () => import("../../../pages/admin-panel/users/Details")
)
const AdminUsersUpdate = lazy(
  () => import("../../../pages/admin-panel/users/Update")
)

export const usersRoutes: AppRoute = {
  key: "adminUsers",
  path: "users",
  label: "Користувачі",
  icon: Users,
  Component: AdminUsersLayout,
  children: [
    {
      key: "adminUsersList",
      path: "",
      label: "Список",
      icon: Database,
      Component: AdminUsersList,
    },
    {
      key: "adminUsersAdd",
      path: "add",
      label: "Додати",
      icon: CirclePlus,
      Component: AdminUsersAdd,
    },
    {
      key: "adminUsersDetail",
      path: ":id",
      label: "Деталі",
      icon: Info,
      Component: AdminUsersDetails,
    },
    {
      key: "adminUsersUpdate",
      path: ":id/update",
      label: "Оновити",
      icon: RefreshCcw,
      Component: AdminUsersUpdate,
    },
  ],
}
