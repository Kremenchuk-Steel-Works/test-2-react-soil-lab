import { lazy } from "react"
import { Database, CirclePlus, Info, RefreshCcw, Building } from "lucide-react"
import type { AppRoute } from "../../../app/routes/paths"
import AdminOrganizationsLayout from "../../../pages/admin-panel/organizations/Layout"

const AdminOrganizationsList = lazy(
  () => import("../../../pages/admin-panel/organizations/list/List")
)
const AdminOrganizationsAdd = lazy(
  () => import("../../../pages/admin-panel/organizations/Add")
)
const AdminOrganizationsDetails = lazy(
  () => import("../../../pages/admin-panel/organizations/Details")
)
const AdminOrganizationsUpdate = lazy(
  () => import("../../../pages/admin-panel/organizations/Update")
)

export const organizationsRoutes: AppRoute = {
  key: "adminOrganizations",
  path: "organizations",
  label: "Організації",
  icon: Building,
  Component: AdminOrganizationsLayout,
  children: [
    {
      key: "adminOrganizationsList",
      path: "",
      label: "Список",
      icon: Database,
      Component: AdminOrganizationsList,
    },
    {
      key: "adminOrganizationsAdd",
      path: "add",
      label: "Додати",
      icon: CirclePlus,
      Component: AdminOrganizationsAdd,
    },
    {
      key: "adminOrganizationsDetail",
      path: ":id",
      label: "Деталі",
      icon: Info,
      Component: AdminOrganizationsDetails,
    },
    {
      key: "adminOrganizationsUpdate",
      path: ":id/update",
      label: "Оновити",
      icon: RefreshCcw,
      Component: AdminOrganizationsUpdate,
    },
  ],
}
