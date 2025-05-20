import {
  Database,
  Users,
  UserCheck,
  UserRoundSearch,
  UserPen,
  type LucideIcon,
} from "lucide-react"
import StreamlitPage from "../pages/StreamlitPage"
import AdminUsersLayout from "../pages/AdminUsers/Layout"
import AdminUsersList from "../pages/AdminUsers/ListTable"
import AdminUsersisAdd from "../pages/AdminUsers/Add"
import AdminUsersDetails from "../pages/AdminUsers/Details"
import AdminUsersEdit from "../pages/AdminUsers/Edit"

export type Permission =
  | "admin"
  | "spectral_analysis_view"
  | "spectral_analysis_add"
  | "quality_dash_view"

export interface AppRoute {
  key: string // unique id, e.g. "spectral_analysis"
  path: string // URL segment, e.g. "/spectral_analysis"
  label: string // human‑readable name
  icon: LucideIcon // sidebar icon
  component: React.ReactNode // top‑level component or layout
  requiredPermissions?: Permission[]
  inSidebar?: boolean
  children?: AppRoute[] // nested sub‑routes
}

export const APP_ROUTES: AppRoute[] = [
  {
    key: "adminUsers",
    path: "/admin-users",
    label: "Користувачі",
    icon: Users,
    component: <AdminUsersLayout />,
    requiredPermissions: ["admin"],
    children: [
      {
        key: "adminUsersList",
        path: "",
        label: "Список користувачів",
        icon: Users,
        component: <AdminUsersList />,
      },
      {
        key: "adminUsersAdd",
        path: "add",
        label: "Додати користувача",
        icon: UserRoundSearch,
        component: <AdminUsersisAdd />,
      },
      {
        key: "adminUsersDetail",
        path: ":id",
        label: "Деталі користувача",
        icon: UserCheck,
        component: <AdminUsersDetails />,
        inSidebar: false,
      },
      {
        key: "adminUsersEdit",
        path: ":id/edit",
        label: "Редагування користувача",
        icon: UserPen,
        component: <AdminUsersEdit />,
        inSidebar: false,
      },
    ],
  },
  {
    key: "quality_dash",
    path: "/quality_dash",
    label: "Quality Dash",
    icon: Database,
    component: <StreamlitPage />,
    requiredPermissions: ["quality_dash_view"],
  },
]
