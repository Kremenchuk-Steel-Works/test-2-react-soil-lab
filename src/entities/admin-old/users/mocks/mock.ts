import { mockPermissions } from '@/entities/admin-old/permissions/mocks/mock'
import { mockRoles } from '@/entities/admin-old/roles/mocks/mock'
import type { UserDetailResponse } from '@/entities/admin-old/users/types/response.dto'

export const mockUsers: UserDetailResponse[] = Array.from({ length: 10 }, (_, i) => {
  const creationDate = new Date()
  creationDate.setDate(creationDate.getDate() - i * 3) // Даты создания "в прошлом"

  const lastLogin = new Date()
  lastLogin.setHours(lastLogin.getHours() - i * 5)

  const isDeleted = i === 9 // Сделаем последнего пользователя "удаленным" для примера

  return {
    id: `user-id-${i + 1}`,
    fullName: `User Name ${i + 1}`,
    email: `user${i + 1}@example.com`,
    isActive: !isDeleted && i % 2 === 0, // Каждый второй активен (кроме удаленного)
    isSuperuser: i === 0, // Только первый пользователь — суперадмин

    // Для суперадмина дадим все права, для остальных — часть
    roles: i === 0 ? [mockRoles[0]] : [mockRoles[2]],
    permissions: i === 0 ? mockPermissions : mockPermissions.slice(1, 3),

    lastLoginAt: i % 3 === 0 ? undefined : lastLogin.toISOString(), // У каждого третьего нет даты входа

    createdAt: creationDate.toISOString(),
    updatedAt: creationDate.toISOString(),
    deletedAt: isDeleted ? new Date().toISOString() : '',
  }
})
