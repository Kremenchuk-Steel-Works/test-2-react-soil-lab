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
} from "lucide-react"
import StreamlitPage from "../pages/StreamlitPage"
import AdminPeopleLayout from "../pages/AdminPanel/People/Layout"
import AdminPeopleAdd from "../pages/AdminPanel/People/Add"
import AdminPeopleDetails from "../pages/AdminPanel/People/Details"
import AdminPeopleUpdate from "../pages/AdminPanel/People/Update"
import AdminPeopleList from "../pages/AdminPanel/People/List/List"
import AdminPanelMain from "../pages/AdminPanel/Main"
import AdminOrganizationsLayout from "../pages/AdminPanel/Organizations/Layout"
import AdminOrganizationsList from "../pages/AdminPanel/Organizations/List/List"
import AdminOrganizationsAdd from "../pages/AdminPanel/Organizations/Add"
import AdminOrganizationsDetails from "../pages/AdminPanel/Organizations/Details"
import AdminOrganizationsUpdate from "../pages/AdminPanel/Organizations/Update"
import AdminPositionsLayout from "../pages/AdminPanel/Positions/Layout"
import AdminPositionsList from "../pages/AdminPanel/Positions/List/List"
import AdminPositionsAdd from "../pages/AdminPanel/Positions/Add"
import AdminPositionsDetails from "../pages/AdminPanel/Positions/Details"
import AdminPositionsUpdate from "../pages/AdminPanel/Positions/Update"
import AdminRolesLayout from "../pages/AdminPanel/Roles/Layout"
import AdminRolesList from "../pages/AdminPanel/Roles/List/List"
import AdminRolesAdd from "../pages/AdminPanel/Roles/Add"
import AdminRolesDetails from "../pages/AdminPanel/Roles/Details"
import AdminRolesUpdate from "../pages/AdminPanel/Roles/Update"
import AdminPanelLayout from "../pages/AdminPanel/Layout"
import AdminUsersLayout from "../pages/AdminPanel/Users/Layout"
import AdminUsersList from "../pages/AdminPanel/Users/List/List"
import AdminUsersAdd from "../pages/AdminPanel/Users/Add"
import AdminUsersDetails from "../pages/AdminPanel/Users/Details"
import AdminUsersUpdate from "../pages/AdminPanel/Users/Update"
import AdminDepartmentsLayout from "../pages/AdminPanel/Departments/Layout"
import AdminDepartmentsList from "../pages/AdminPanel/Departments/List/List"
import AdminDepartmentsAdd from "../pages/AdminPanel/Departments/Add"
import AdminDepartmentsDetails from "../pages/AdminPanel/Departments/Details"
import AdminDepartmentsUpdate from "../pages/AdminPanel/Departments/Update"
import AdminPermissionsLayout from "../pages/AdminPanel/Permissions/Layout"
import AdminPermissionsList from "../pages/AdminPanel/Permissions/List/List"
import AdminPermissionsAdd from "../pages/AdminPanel/Permissions/Add"
import AdminPermissionsDetails from "../pages/AdminPanel/Permissions/Details"
import AdminPermissionsUpdate from "../pages/AdminPanel/Permissions/Update"
import AdminCityLayout from "../pages/AdminPanel/City/Layout"
import AdminCityList from "../pages/AdminPanel/City/List/List"
import AdminCityAdd from "../pages/AdminPanel/City/Add"
import AdminCityDetails from "../pages/AdminPanel/City/Details"
import AdminCityUpdate from "../pages/AdminPanel/City/Update"
import AdminCountryLayout from "../pages/AdminPanel/Country/Layout"
import AdminCountryList from "../pages/AdminPanel/Country/List/List"
import AdminCountryAdd from "../pages/AdminPanel/Country/Add"
import AdminCountryDetails from "../pages/AdminPanel/Country/Details"
import AdminCountryUpdate from "../pages/AdminPanel/Country/Update"
// import AdminUsersLayoutOld from "../pages/AdminUsers/Layout"
// import AdminUsersDetailsOld from "../pages/AdminUsers/Details"
// import AdminUsersEditOld from "../pages/AdminUsers/Edit"
// import AdminUsersListOld from "../pages/AdminUsers/AdminUsersList/List"

export type Permission =
  | "admin"
  | "spectral_analysis_view"
  | "spectral_analysis_add"
  | "quality_dash_view"
  | "library_edit"

export interface AppRoute {
  key: string
  path: string
  label: string
  icon: LucideIcon
  component: React.ReactNode
  requiredPermissions?: Permission[]
  inSidebar?: boolean
  children?: AppRoute[]
}

export const APP_ROUTES: AppRoute[] = [
  // {
  //   key: "adminUsers",
  //   path: "/admin-users",
  //   label: "Користувачі",
  //   icon: Users,
  //   component: <AdminUsersLayoutOld />,
  //   requiredPermissions: ["admin"],
  //   children: [
  //     {
  //       key: "adminUsersList",
  //       path: "",
  //       label: "Список користувачів",
  //       icon: Users,
  //       component: <AdminUsersListOld />,
  //     },
  //     {
  //       key: "adminUsersDetail",
  //       path: ":id",
  //       label: "Деталі користувача",
  //       icon: UserCheck,
  //       component: <AdminUsersDetailsOld />,
  //       inSidebar: false,
  //     },
  //     {
  //       key: "adminUsersEdit",
  //       path: ":id/edit",
  //       label: "Редагування користувача",
  //       icon: UserPen,
  //       component: <AdminUsersEditOld />,
  //       inSidebar: false,
  //     },
  //   ],
  // },
  {
    key: "admin",
    path: "/admin",
    label: "Адмін панель",
    icon: Shield,
    component: <AdminPanelLayout />,
    requiredPermissions: ["admin"],
    children: [
      {
        key: "adminPanel",
        path: "",
        label: "",
        icon: Users,
        component: <AdminPanelMain />,
        inSidebar: false,
      },
      {
        key: "adminPeople",
        path: "people",
        label: "Люди",
        icon: Users,
        component: <AdminPeopleLayout />,
        children: [
          {
            key: "adminPeopleList",
            path: "",
            label: "Список",
            icon: Database,
            component: <AdminPeopleList />,
          },
          {
            key: "adminPeopleAdd",
            path: "add",
            label: "Додати",
            icon: CirclePlus,
            component: <AdminPeopleAdd />,
          },
          {
            key: "adminPeopleDetail",
            path: ":id",
            label: "Деталі",
            icon: Info,
            component: <AdminPeopleDetails />,
          },
          {
            key: "adminPeopleUpdate",
            path: ":id/update",
            label: "Оновити",
            icon: RefreshCcw,
            component: <AdminPeopleUpdate />,
          },
        ],
      },
      {
        key: "adminUsers",
        path: "users",
        label: "Користувачі",
        icon: Users,
        component: <AdminUsersLayout />,
        children: [
          {
            key: "adminUsersList",
            path: "",
            label: "Список",
            icon: Database,
            component: <AdminUsersList />,
          },
          {
            key: "adminUsersAdd",
            path: "add",
            label: "Додати",
            icon: CirclePlus,
            component: <AdminUsersAdd />,
          },
          {
            key: "adminUsersDetail",
            path: ":id",
            label: "Деталі",
            icon: Info,
            component: <AdminUsersDetails />,
          },
          {
            key: "adminUsersUpdate",
            path: ":id/update",
            label: "Оновити",
            icon: RefreshCcw,
            component: <AdminUsersUpdate />,
          },
        ],
      },
      {
        key: "adminOrganizations",
        path: "organizations",
        label: "Організації",
        icon: Building,
        component: <AdminOrganizationsLayout />,
        children: [
          {
            key: "adminOrganizationsList",
            path: "",
            label: "Список",
            icon: Database,
            component: <AdminOrganizationsList />,
          },
          {
            key: "adminOrganizationsAdd",
            path: "add",
            label: "Додати",
            icon: CirclePlus,
            component: <AdminOrganizationsAdd />,
          },
          {
            key: "adminOrganizationsDetail",
            path: ":id",
            label: "Деталі",
            icon: Info,
            component: <AdminOrganizationsDetails />,
          },
          {
            key: "adminOrganizationsUpdate",
            path: ":id/update",
            label: "Оновити",
            icon: RefreshCcw,
            component: <AdminOrganizationsUpdate />,
          },
        ],
      },
      {
        key: "adminPositions",
        path: "positions",
        label: "Посади",
        icon: BriefcaseBusiness,
        component: <AdminPositionsLayout />,
        children: [
          {
            key: "adminPositionsList",
            path: "",
            label: "Список",
            icon: Database,
            component: <AdminPositionsList />,
          },
          {
            key: "adminPositionsAdd",
            path: "add",
            label: "Додати",
            icon: CirclePlus,
            component: <AdminPositionsAdd />,
          },
          {
            key: "adminPositionsDetail",
            path: ":id",
            label: "Деталі",
            icon: Info,
            component: <AdminPositionsDetails />,
          },
          {
            key: "adminPositionsUpdate",
            path: ":id/update",
            label: "Оновити",
            icon: RefreshCcw,
            component: <AdminPositionsUpdate />,
          },
        ],
      },
      {
        key: "adminDepartments",
        path: "departments",
        label: "Відділи",
        icon: Layers,
        component: <AdminDepartmentsLayout />,
        children: [
          {
            key: "adminDepartmentsList",
            path: "",
            label: "Список",
            icon: Database,
            component: <AdminDepartmentsList />,
          },
          {
            key: "adminDepartmentsAdd",
            path: "add",
            label: "Додати",
            icon: CirclePlus,
            component: <AdminDepartmentsAdd />,
          },
          {
            key: "adminDepartmentsDetail",
            path: ":id",
            label: "Деталі",
            icon: Info,
            component: <AdminDepartmentsDetails />,
          },
          {
            key: "adminDepartmentsUpdate",
            path: ":id/update",
            label: "Оновити",
            icon: RefreshCcw,
            component: <AdminDepartmentsUpdate />,
          },
        ],
      },
      {
        key: "adminRoles",
        path: "roles",
        label: "Ролі",
        icon: ShieldCheck,
        component: <AdminRolesLayout />,
        children: [
          {
            key: "adminPositionsList",
            path: "",
            label: "Список",
            icon: Database,
            component: <AdminRolesList />,
          },
          {
            key: "adminRolesAdd",
            path: "add",
            label: "Додати",
            icon: CirclePlus,
            component: <AdminRolesAdd />,
          },
          {
            key: "adminPositionsDetail",
            path: ":id",
            label: "Деталі",
            icon: Info,
            component: <AdminRolesDetails />,
          },
          {
            key: "adminPositionsUpdate",
            path: ":id/update",
            label: "Оновити",
            icon: RefreshCcw,
            component: <AdminRolesUpdate />,
          },
        ],
      },
      {
        key: "adminPermissions",
        path: "permissions",
        label: "Права доступу",
        icon: Lock,
        component: <AdminPermissionsLayout />,
        children: [
          {
            key: "adminPermissionsList",
            path: "",
            label: "Список",
            icon: Database,
            component: <AdminPermissionsList />,
          },
          {
            key: "adminPermissionsAdd",
            path: "add",
            label: "Додати",
            icon: CirclePlus,
            component: <AdminPermissionsAdd />,
          },
          {
            key: "adminPermissionsDetail",
            path: ":id",
            label: "Деталі",
            icon: Info,
            component: <AdminPermissionsDetails />,
          },
          {
            key: "adminPermissionsUpdate",
            path: ":id/update",
            label: "Оновити",
            icon: RefreshCcw,
            component: <AdminPermissionsUpdate />,
          },
        ],
      },
      {
        key: "adminCountry",
        path: "country",
        label: "Країни",
        icon: Globe,
        component: <AdminCountryLayout />,
        children: [
          {
            key: "adminCountryList",
            path: "",
            label: "Список",
            icon: Database,
            component: <AdminCountryList />,
          },
          {
            key: "adminCountryAdd",
            path: "add",
            label: "Додати",
            icon: CirclePlus,
            component: <AdminCountryAdd />,
          },
          {
            key: "adminCountryDetail",
            path: ":id",
            label: "Деталі",
            icon: Info,
            component: <AdminCountryDetails />,
          },
          {
            key: "adminCountryUpdate",
            path: ":id/update",
            label: "Оновити",
            icon: RefreshCcw,
            component: <AdminCountryUpdate />,
          },
        ],
      },
      {
        key: "adminCity",
        path: "city",
        label: "Міста",
        icon: Languages,
        component: <AdminCityLayout />,
        children: [
          {
            key: "adminCityList",
            path: "",
            label: "Список",
            icon: Database,
            component: <AdminCityList />,
          },
          {
            key: "adminCityAdd",
            path: "add",
            label: "Додати",
            icon: CirclePlus,
            component: <AdminCityAdd />,
          },
          {
            key: "adminCityDetail",
            path: ":id",
            label: "Деталі",
            icon: Info,
            component: <AdminCityDetails />,
          },
          {
            key: "adminCityUpdate",
            path: ":id/update",
            label: "Оновити",
            icon: RefreshCcw,
            component: <AdminCityUpdate />,
          },
        ],
      },
    ],
  },
  // {
  //   key: "library",
  //   path: "/library",
  //   label: "Бібліотека",
  //   icon: Library,
  //   component: <LibraryLayout />,
  //   inSidebar: false,
  //   children: [
  //     {
  //       key: "libraryList",
  //       path: "",
  //       label: "Архів",
  //       icon: FileStack,
  //       component: <LibraryList />,
  //     },
  //     {
  //       key: "libraryAdd",
  //       path: "add",
  //       label: "Додати документ",
  //       icon: FilePlus,
  //       component: <LibraryAdd />,
  //       requiredPermissions: ["library_edit", "admin"],
  //     },
  //     {
  //       key: "libraryDetail",
  //       path: ":id",
  //       label: "Деталі",
  //       icon: FileText,
  //       component: <LibraryDetails />,
  //       inSidebar: false,
  //     },
  //     {
  //       key: "libraryEdit",
  //       path: ":id/edit",
  //       label: "Редагування",
  //       icon: FilePen,
  //       component: <LibraryEdit />,
  //       inSidebar: false,
  //       requiredPermissions: ["library_edit", "admin"],
  //     },
  //   ],
  // },
  {
    key: "quality_dash",
    path: "/quality_dash",
    label: "Quality Dash",
    icon: Database,
    component: <StreamlitPage />,
    requiredPermissions: ["quality_dash_view", "admin"],
  },
]
