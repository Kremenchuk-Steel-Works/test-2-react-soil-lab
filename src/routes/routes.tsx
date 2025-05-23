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
// import AdminUsersLayout from "../pages/AdminUsers/Layout"
// import AdminUsersList from "../pages/AdminUsers/AdminUsersList/List"
// import AdminUsersisAdd from "../pages/AdminUsers/Add"
// import AdminUsersDetails from "../pages/AdminUsers/Details"
// import AdminUsersEdit from "../pages/AdminUsers/Edit"
import LibraryLayout from "../pages/Library/Layout"
import LibraryList from "../pages/Library/List/List"
import LibraryAdd from "../pages/Library/Add"
import LibraryDetails from "../pages/Library/Details"
import AdminPeopleLayout from "../pages/AdminPanel/People/Layout"
import AdminPeopleAdd from "../pages/AdminPanel/People/Add"
import AdminPeopleDetails from "../pages/AdminPanel/People/Details"
import AdminPeopleUpdate from "../pages/AdminPanel/People/Update"
import LibraryEdit from "../pages/Library/Edit"
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
  //   component: <AdminUsersLayout />,
  //   requiredPermissions: ["admin"],
  //   children: [
  //     {
  //       key: "adminUsersList",
  //       path: "",
  //       label: "Список користувачів",
  //       icon: Users,
  //       component: <AdminUsersList />,
  //     },
  //     {
  //       key: "adminUsersAdd",
  //       path: "add",
  //       label: "Додати користувача",
  //       icon: UserRoundSearch,
  //       component: <AdminUsersisAdd />,
  //     },
  //     {
  //       key: "adminUsersDetail",
  //       path: ":id",
  //       label: "Деталі користувача",
  //       icon: UserCheck,
  //       component: <AdminUsersDetails />,
  //       inSidebar: false,
  //     },
  //     {
  //       key: "adminUsersEdit",
  //       path: ":id/edit",
  //       label: "Редагування користувача",
  //       icon: UserPen,
  //       component: <AdminUsersEdit />,
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
