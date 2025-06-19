import {
  Database,
  Users,
  type LucideIcon,
  Shield,
  Building,
  Layers,
  ShieldCheck,
  Lock,
  CirclePlus,
  Info,
  RefreshCcw,
  BriefcaseBusiness,
  Languages,
  Globe,
  Calculator,
} from "lucide-react"
import AdminPanelMain from "../../pages/admin-panel/Main"
import AdminOrganizationsLayout from "../../pages/admin-panel/organizations/Layout"
import AdminOrganizationsList from "../../pages/admin-panel/organizations/list/List"
import AdminOrganizationsAdd from "../../pages/admin-panel/organizations/Add"
import AdminOrganizationsDetails from "../../pages/admin-panel/organizations/Details"
import AdminOrganizationsUpdate from "../../pages/admin-panel/organizations/Update"
import AdminPositionsLayout from "../../pages/admin-panel/positions/Layout"
import AdminPositionsList from "../../pages/admin-panel/positions/list/List"
import AdminPositionsAdd from "../../pages/admin-panel/positions/Add"
import AdminPositionsDetails from "../../pages/admin-panel/positions/Details"
import AdminPositionsUpdate from "../../pages/admin-panel/positions/Update"
import AdminRolesLayout from "../../pages/admin-panel/roles/Layout"
import AdminRolesList from "../../pages/admin-panel/roles/list/List"
import AdminRolesAdd from "../../pages/admin-panel/roles/Add"
import AdminRolesDetails from "../../pages/admin-panel/roles/Details"
import AdminRolesUpdate from "../../pages/admin-panel/roles/Update"
import AdminPanelLayout from "../../pages/admin-panel/Layout"
import AdminUsersLayout from "../../pages/admin-panel/users/Layout"
import AdminUsersList from "../../pages/admin-panel/users/list/List"
import AdminUsersAdd from "../../pages/admin-panel/users/Add"
import AdminUsersDetails from "../../pages/admin-panel/users/Details"
import AdminUsersUpdate from "../../pages/admin-panel/users/Update"
import AdminDepartmentsLayout from "../../pages/admin-panel/departments/Layout"
import AdminDepartmentsList from "../../pages/admin-panel/departments/list/List"
import AdminDepartmentsAdd from "../../pages/admin-panel/departments/Add"
import AdminDepartmentsDetails from "../../pages/admin-panel/departments/Details"
import AdminDepartmentsUpdate from "../../pages/admin-panel/departments/Update"
import AdminPermissionsLayout from "../../pages/admin-panel/permissions/Layout"
import AdminPermissionsList from "../../pages/admin-panel/permissions/list/List"
import AdminPermissionsAdd from "../../pages/admin-panel/permissions/Add"
import AdminPermissionsDetails from "../../pages/admin-panel/permissions/Details"
import AdminPermissionsUpdate from "../../pages/admin-panel/permissions/Update"
import AdminCityLayout from "../../pages/admin-panel/city/Layout"
import AdminCityList from "../../pages/admin-panel/city/list/List"
import AdminCityAdd from "../../pages/admin-panel/city/Add"
import AdminCityDetails from "../../pages/admin-panel/city/Details"
import AdminCityUpdate from "../../pages/admin-panel/city/Update"
import AdminCountryLayout from "../../pages/admin-panel/country/Layout"
import AdminCountryList from "../../pages/admin-panel/country/list/List"
import AdminCountryAdd from "../../pages/admin-panel/country/Add"
import AdminCountryDetails from "../../pages/admin-panel/country/Details"
import AdminCountryUpdate from "../../pages/admin-panel/country/Update"
import { peopleRoutes } from "../../entities/admin/people/routes"
import StreamlitDashboard from "../../pages/StreamlitDashboard"
import StreamlitCalculator from "../../pages/StreamlitCalculator"

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
      {
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
      },
      {
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
      },
      {
        key: "adminPositions",
        path: "positions",
        label: "Посади",
        icon: BriefcaseBusiness,
        Component: AdminPositionsLayout,
        children: [
          {
            key: "adminPositionsList",
            path: "",
            label: "Список",
            icon: Database,
            Component: AdminPositionsList,
          },
          {
            key: "adminPositionsAdd",
            path: "add",
            label: "Додати",
            icon: CirclePlus,
            Component: AdminPositionsAdd,
          },
          {
            key: "adminPositionsDetail",
            path: ":id",
            label: "Деталі",
            icon: Info,
            Component: AdminPositionsDetails,
          },
          {
            key: "adminPositionsUpdate",
            path: ":id/update",
            label: "Оновити",
            icon: RefreshCcw,
            Component: AdminPositionsUpdate,
          },
        ],
      },
      {
        key: "adminDepartments",
        path: "departments",
        label: "Відділи",
        icon: Layers,
        Component: AdminDepartmentsLayout,
        children: [
          {
            key: "adminDepartmentsList",
            path: "",
            label: "Список",
            icon: Database,
            Component: AdminDepartmentsList,
          },
          {
            key: "adminDepartmentsAdd",
            path: "add",
            label: "Додати",
            icon: CirclePlus,
            Component: AdminDepartmentsAdd,
          },
          {
            key: "adminDepartmentsDetail",
            path: ":id",
            label: "Деталі",
            icon: Info,
            Component: AdminDepartmentsDetails,
          },
          {
            key: "adminDepartmentsUpdate",
            path: ":id/update",
            label: "Оновити",
            icon: RefreshCcw,
            Component: AdminDepartmentsUpdate,
          },
        ],
      },
      {
        key: "adminRoles",
        path: "roles",
        label: "Ролі",
        icon: ShieldCheck,
        Component: AdminRolesLayout,
        children: [
          {
            key: "adminPositionsList",
            path: "",
            label: "Список",
            icon: Database,
            Component: AdminRolesList,
          },
          {
            key: "adminRolesAdd",
            path: "add",
            label: "Додати",
            icon: CirclePlus,
            Component: AdminRolesAdd,
          },
          {
            key: "adminPositionsDetail",
            path: ":id",
            label: "Деталі",
            icon: Info,
            Component: AdminRolesDetails,
          },
          {
            key: "adminPositionsUpdate",
            path: ":id/update",
            label: "Оновити",
            icon: RefreshCcw,
            Component: AdminRolesUpdate,
          },
        ],
      },
      {
        key: "adminPermissions",
        path: "permissions",
        label: "Права доступу",
        icon: Lock,
        Component: AdminPermissionsLayout,
        children: [
          {
            key: "adminPermissionsList",
            path: "",
            label: "Список",
            icon: Database,
            Component: AdminPermissionsList,
          },
          {
            key: "adminPermissionsAdd",
            path: "add",
            label: "Додати",
            icon: CirclePlus,
            Component: AdminPermissionsAdd,
          },
          {
            key: "adminPermissionsDetail",
            path: ":id",
            label: "Деталі",
            icon: Info,
            Component: AdminPermissionsDetails,
          },
          {
            key: "adminPermissionsUpdate",
            path: ":id/update",
            label: "Оновити",
            icon: RefreshCcw,
            Component: AdminPermissionsUpdate,
          },
        ],
      },
      {
        key: "adminCountry",
        path: "country",
        label: "Країни",
        icon: Globe,
        Component: AdminCountryLayout,
        children: [
          {
            key: "adminCountryList",
            path: "",
            label: "Список",
            icon: Database,
            Component: AdminCountryList,
          },
          {
            key: "adminCountryAdd",
            path: "add",
            label: "Додати",
            icon: CirclePlus,
            Component: AdminCountryAdd,
          },
          {
            key: "adminCountryDetail",
            path: ":id",
            label: "Деталі",
            icon: Info,
            Component: AdminCountryDetails,
          },
          {
            key: "adminCountryUpdate",
            path: ":id/update",
            label: "Оновити",
            icon: RefreshCcw,
            Component: AdminCountryUpdate,
          },
        ],
      },
      {
        key: "adminCity",
        path: "city",
        label: "Міста",
        icon: Languages,
        Component: AdminCityLayout,
        children: [
          {
            key: "adminCityList",
            path: "",
            label: "Список",
            icon: Database,
            Component: AdminCityList,
          },
          {
            key: "adminCityAdd",
            path: "add",
            label: "Додати",
            icon: CirclePlus,
            Component: AdminCityAdd,
          },
          {
            key: "adminCityDetail",
            path: ":id",
            label: "Деталі",
            icon: Info,
            Component: AdminCityDetails,
          },
          {
            key: "adminCityUpdate",
            path: ":id/update",
            label: "Оновити",
            icon: RefreshCcw,
            Component: AdminCityUpdate,
          },
        ],
      },
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
    key: "streamliCalculator",
    path: "/streamlit-calculator",
    label: "Calculator",
    icon: Calculator,
    Component: StreamlitCalculator,
    requiredPermissions: ["calculator_view"],
  },
]
