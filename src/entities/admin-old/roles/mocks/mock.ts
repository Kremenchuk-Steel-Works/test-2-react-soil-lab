import { mockPermissions } from '@/entities/admin-old/permissions/mocks/mock'
import type { PermissionListItemResponse } from '@/entities/admin-old/permissions/types/response.dto'
import type { RoleBase } from '@/entities/admin-old/roles/types/base.model'
import type { RoleDetailResponse } from '@/entities/admin-old/roles/types/response.dto'

const baseRoles: RoleBase[] = [
  {
    name: 'Administrator',
    description: 'Полный доступ ко всем функциям системы.',
  },
  {
    name: 'Content Manager',
    description: 'Управление контентом, но без доступа к настройкам.',
  },
  {
    name: 'Support Agent',
    description: 'Доступ только к просмотру пользователей.',
  },
  {
    name: 'Archived Role',
    description: 'Эта роль была заархивирована и больше не используется.',
  },
]

export const mockRoles: RoleDetailResponse[] = Array.from({ length: baseRoles.length }, (_, i) => {
  const creationDate = new Date()
  creationDate.setDate(creationDate.getDate() - i * 10)

  const isArchived = baseRoles[i].name === 'Archived Role'

  // Определяем права для каждой роли
  let permissions: PermissionListItemResponse[]
  // Адаптируем данные с запроса под форму
  const originalPermissions = mockPermissions.map((perm) => ({
    ...perm,
    departmentName: perm.department.name,
  }))
  switch (baseRoles[i].name) {
    case 'Administrator':
      permissions = originalPermissions // Все права
      break
    case 'Content Manager':
      permissions = originalPermissions.slice(0, 4) // Первые 4 права
      break
    default:
      permissions = [] // У заархивированной роли нет прав
  }

  return {
    id: i + 1,
    ...baseRoles[i],
    permissions,
    createdAt: creationDate.toISOString(),
    updatedAt: creationDate.toISOString(),
    archivedAt: isArchived ? new Date().toISOString() : 'false',
  }
})
