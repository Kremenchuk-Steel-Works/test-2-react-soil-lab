// export type User = {
//   email: string
//   id: number
//   profile: {
//     firstName: string
//     lastName: string
//     employeeNumber: string
//     id: number
//     userId: number
//     createdAt: string
//     updatedAt: string
//   }
//   roles: {
//     name: string
//     description: string
//     id: number
//   }[]
//   permissions: {
//     name: string
//     description: string
//     id: number
//   }[]
//   createdAt: string
//   updatedAt: string
// }

// export type UserResponse = Omit<User, "permissions" | "createdAt" | "updatedAt">

// export type UsersData = {
//   users: UserResponse[]
//   page: number
//   totalPages: number
//   totalItems: number
// }

// export type UsersAdd = {
//   email: string
//   rawPassword: string
//   profile: {
//     firstName: string
//     lastName: string
//     employeeNumber: string
//   }
// }

// export type UsersEdit = Omit<UsersAdd, "rawPassword">
