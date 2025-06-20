import {
  Database,
  Users,
  type LucideIcon,
  Shield,
  Calculator,
} from "lucide-react"
import AdminPanelMain from "../../pages/admin-panel/Main"
import AdminPanelLayout from "../../pages/admin-panel/Layout"
import { peopleRoutes } from "../../entities/admin/people/routes"
import StreamlitDashboard from "../../pages/StreamlitDashboard"
import StreamlitCalculator from "../../pages/StreamlitCalculator"
import { usersRoutes } from "../../entities/admin/users/routes"
import { organizationsRoutes } from "../../entities/admin/organizations/routes"
import { positonsRoutes } from "../../entities/admin/positions/routes"
import { departmentsRoutes } from "../../entities/admin/departments/routes"
import { rolesRoutes } from "../../entities/admin/roles/routes"
import { permissionsRoutes } from "../../entities/admin/permissions/routes"
import { countryRoutes } from "../../entities/admin/country/routes"
import { cityRoutes } from "../../entities/admin/city/routes"

export type Permission =
  | "admin"
  | "spectral_analysis_view"
  | "spectral_analysis_add"
  | "quality_dash_view"
  | "calculator_view"
  | "library_edit"

export interface AppRoute {
  key: string
  path: string
  label: string
  icon: LucideIcon
  Component:
    | React.LazyExoticComponent<React.ComponentType<any>>
    | React.ComponentType<any>
  requiredPermissions?: Permission[]
  inSidebar?: boolean
  children?: AppRoute[]
}

export const APP_ROUTES: AppRoute[] = [
  {
    key: "admin",
    path: "/admin",
    label: "Адмін панель",
    icon: Shield,
    Component: AdminPanelLayout,
    requiredPermissions: ["admin"],
    children: [
      {
        key: "adminPanel",
        path: "",
        label: "",
        icon: Users,
        Component: AdminPanelMain,
        inSidebar: false,
      },
      peopleRoutes,
      usersRoutes,
      organizationsRoutes,
      positonsRoutes,
      departmentsRoutes,
      rolesRoutes,
      permissionsRoutes,
      countryRoutes,
      cityRoutes,
    ],
  },
  {
    key: "streamlitDashboard",
    path: "/streamlit-dashboard",
    label: "Quality Dash",
    icon: Database,
    Component: StreamlitDashboard,
    requiredPermissions: ["quality_dash_view"],
  },
  {
    key: "streamlitCalculator",
    path: "/streamlit-calculator",
    label: "Calculator",
    icon: Calculator,
    Component: StreamlitCalculator,
    requiredPermissions: ["calculator_view"],
  },
]
