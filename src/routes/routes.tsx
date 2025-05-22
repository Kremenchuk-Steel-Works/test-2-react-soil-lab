import {
  Database,
  Users,
  UserCheck,
  UserRoundSearch,
  UserPen,
  type LucideIcon,
  Library,
  FileStack,
  FilePlus,
  FileText,
  FilePen,
  Shield,
  Building,
  Layers,
  ShieldCheck,
  Lock,
  CirclePlus,
  Info,
  RefreshCcw,
  BriefcaseBusiness,
} from "lucide-react"
import StreamlitPage from "../pages/StreamlitPage"
import AdminUsersLayout from "../pages/AdminUsers/Layout"
import AdminUsersList from "../pages/AdminUsers/AdminUsersList/List"
import AdminUsersisAdd from "../pages/AdminUsers/Add"
import AdminUsersDetails from "../pages/AdminUsers/Details"
import AdminUsersEdit from "../pages/AdminUsers/Edit"
import LibraryLayout from "../pages/Library/Layout"
import LibraryList from "../pages/Library/List/List"
import LibraryAdd from "../pages/Library/Add"
import LibraryDetails from "../pages/Library/Details"
import AdminPanelLayout from "../pages/AdminPanel/Layout"
import AdminPeopleLayout from "../pages/AdminPanel/People/Layout"
import AdminPeopleAdd from "../pages/AdminPanel/People/Add"
import AdminPeopleDetails from "../pages/AdminPanel/People/Details"
import AdminPeopleUpdate from "../pages/AdminPanel/People/Update"
import LibraryEdit from "../pages/Library/Edit"
import AdminPeopleList from "../pages/AdminPanel/People/List/List"

export type Permission =
  | "admin"
  | "spectral_analysis_view"
  | "spectral_analysis_add"
  | "quality_dash_view"
  | "library_edit"

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
    key: "admin",
    path: "/admin",
    label: "Адмін панель",
    icon: Shield,
    component: <AdminPanelLayout />,
    requiredPermissions: ["admin"],
    children: [
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
      // {
      //   key: "adminUsers",
      //   path: "users",
      //   label: "Користувачі",
      //   icon: Users,
      //   component: <AdminUsersisAdd />,
      //   children: [
      //     {
      //       key: "adminUsersList",
      //       path: "",
      //       label: "Список",
      //       icon: Database,
      //       component: <AdminUsersList />,
      //     },
      //     {
      //       key: "adminUsersAdd",
      //       path: "add",
      //       label: "Додати",
      //       icon: CirclePlus,
      //       component: <AdminUsersList />,
      //     },
      //     {
      //       key: "adminUsersDetail",
      //       path: ":id",
      //       label: "Деталі",
      //       icon: Info,
      //       component: <AdminUsersList />,
      //     },
      //     {
      //       key: "adminUsersUpdate",
      //       path: ":id/update",
      //       label: "Оновити",
      //       icon: RefreshCcw,
      //       component: <AdminUsersList />,
      //     },
      //   ],
      // },
      // {
      //   key: "adminOrganizations",
      //   path: "organizations",
      //   label: "Організації",
      //   icon: Building,
      //   component: <AdminUsersisAdd />,
      //   children: [
      //     {
      //       key: "adminOrganizationsList",
      //       path: "",
      //       label: "Список",
      //       icon: Database,
      //       component: <AdminUsersList />,
      //     },
      //     {
      //       key: "adminOrganizationsAdd",
      //       path: "add",
      //       label: "Додати",
      //       icon: CirclePlus,
      //       component: <AdminUsersList />,
      //     },
      //     {
      //       key: "adminOrganizationsDetail",
      //       path: ":id",
      //       label: "Деталі",
      //       icon: Info,
      //       component: <AdminUsersList />,
      //     },
      //     {
      //       key: "adminOrganizationsUpdate",
      //       path: ":id/update",
      //       label: "Оновити",
      //       icon: RefreshCcw,
      //       component: <AdminUsersList />,
      //     },
      //   ],
      // },
      // {
      //   key: "adminPositions",
      //   path: "positions",
      //   label: "Посади",
      //   icon: BriefcaseBusiness,
      //   component: <AdminUsersisAdd />,
      //   children: [
      //     {
      //       key: "adminPositionsList",
      //       path: "",
      //       label: "Список",
      //       icon: Database,
      //       component: <AdminUsersList />,
      //     },
      //     {
      //       key: "adminPositionsAdd",
      //       path: "add",
      //       label: "Додати",
      //       icon: CirclePlus,
      //       component: <AdminUsersList />,
      //     },
      //     {
      //       key: "adminPositionsDetail",
      //       path: ":id",
      //       label: "Деталі",
      //       icon: Info,
      //       component: <AdminUsersList />,
      //     },
      //     {
      //       key: "adminPositionsUpdate",
      //       path: ":id/update",
      //       label: "Оновити",
      //       icon: RefreshCcw,
      //       component: <AdminUsersList />,
      //     },
      //   ],
      // },
      // {
      //   key: "adminDepartments",
      //   path: "departments",
      //   label: "Відділи",
      //   icon: Layers,
      //   component: <AdminUsersisAdd />,
      //   children: [
      //     {
      //       key: "adminDepartmentsList",
      //       path: "",
      //       label: "Список",
      //       icon: Database,
      //       component: <AdminUsersList />,
      //     },
      //     {
      //       key: "adminDepartmentsAdd",
      //       path: "add",
      //       label: "Додати",
      //       icon: CirclePlus,
      //       component: <AdminUsersList />,
      //     },
      //     {
      //       key: "adminDepartmentsDetail",
      //       path: ":id",
      //       label: "Деталі",
      //       icon: Info,
      //       component: <AdminUsersList />,
      //     },
      //     {
      //       key: "adminDepartmentsUpdate",
      //       path: ":id/update",
      //       label: "Оновити",
      //       icon: RefreshCcw,
      //       component: <AdminUsersList />,
      //     },
      //   ],
      // },
      // {
      //   key: "adminRoles",
      //   path: "roles",
      //   label: "Ролі",
      //   icon: ShieldCheck,
      //   component: <AdminUsersisAdd />,
      //   children: [
      //     {
      //       key: "adminPositionsList",
      //       path: "",
      //       label: "Список",
      //       icon: Database,
      //       component: <AdminUsersList />,
      //     },
      //     {
      //       key: "adminRolesAdd",
      //       path: "add",
      //       label: "Додати",
      //       icon: CirclePlus,
      //       component: <AdminUsersList />,
      //     },
      //     {
      //       key: "adminPositionsDetail",
      //       path: ":id",
      //       label: "Деталі",
      //       icon: Info,
      //       component: <AdminUsersList />,
      //     },
      //     {
      //       key: "adminPositionsUpdate",
      //       path: ":id/update",
      //       label: "Оновити",
      //       icon: RefreshCcw,
      //       component: <AdminUsersList />,
      //     },
      //   ],
      // },
      // {
      //   key: "adminPermissions",
      //   path: "permissions",
      //   label: "Права доступу",
      //   icon: Lock,
      //   component: <AdminUsersisAdd />,
      //   children: [
      //     {
      //       key: "adminPermissionsList",
      //       path: "",
      //       label: "Список",
      //       icon: Database,
      //       component: <AdminUsersList />,
      //     },
      //     {
      //       key: "adminPermissionsAdd",
      //       path: "add",
      //       label: "Додати",
      //       icon: CirclePlus,
      //       component: <AdminUsersList />,
      //     },
      //     {
      //       key: "adminPermissionsDetail",
      //       path: ":id",
      //       label: "Деталі",
      //       icon: Info,
      //       component: <AdminUsersList />,
      //     },
      //     {
      //       key: "adminPermissionsUpdate",
      //       path: ":id/update",
      //       label: "Оновити",
      //       icon: RefreshCcw,
      //       component: <AdminUsersList />,
      //     },
      //   ],
      // },
    ],
  },
  {
    key: "library",
    path: "/library",
    label: "Бібліотека",
    icon: Library,
    component: <LibraryLayout />,
    inSidebar: false,
    children: [
      {
        key: "libraryList",
        path: "",
        label: "Архів",
        icon: FileStack,
        component: <LibraryList />,
      },
      {
        key: "libraryAdd",
        path: "add",
        label: "Додати документ",
        icon: FilePlus,
        component: <LibraryAdd />,
        requiredPermissions: ["library_edit", "admin"],
      },
      {
        key: "libraryDetail",
        path: ":id",
        label: "Деталі",
        icon: FileText,
        component: <LibraryDetails />,
        inSidebar: false,
      },
      {
        key: "libraryEdit",
        path: ":id/edit",
        label: "Редагування",
        icon: FilePen,
        component: <LibraryEdit />,
        inSidebar: false,
        requiredPermissions: ["library_edit", "admin"],
      },
    ],
  },
  {
    key: "quality_dash",
    path: "/quality_dash",
    label: "Quality Dash",
    icon: Database,
    component: <StreamlitPage />,
    requiredPermissions: ["quality_dash_view", "admin"],
  },
]
