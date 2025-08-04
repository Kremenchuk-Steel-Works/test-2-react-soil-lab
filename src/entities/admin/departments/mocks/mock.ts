import type { DepartmentBase } from '@/entities/admin/departments/types/base.model'
import type { DepartmentDetailResponse } from '@/entities/admin/departments/types/response.dto'
import { mockPermissions } from '@/entities/admin/permissions/mocks/mock'
import type { PermissionShortResponse } from '@/entities/admin/permissions/types/response.dto'

const baseDepartments: DepartmentBase[] = [
  { name: 'Engineering', description: 'Разработка продуктов компании.' },
  { name: 'Human Resources', description: 'Управление персоналом.' },
  { name: 'Marketing', description: 'Продвижение продуктов на рынке.' },
  { name: 'Finance (Archived)', description: 'Финансовый отдел, был расформирован.' },
]

export const mockDepartments: DepartmentDetailResponse[] = baseDepartments.map((dept, i) => {
  const departmentId = `dep-id-${i + 1}`
  const creationDate = new Date()
  creationDate.setDate(creationDate.getDate() - i * 15)
  const isArchived = dept.name.includes('(Archived)')

  // Для каждого департамента создаем свой набор прав с правильным departmentId
  const permissions: PermissionShortResponse[] = mockPermissions
    .slice(0, 4 - i) // Даем разное количество прав для примера
    .map((perm, permIndex) => ({
      ...perm,
      id: i * 10 + permIndex + 1, // Уникальный ID для права
      departmentId: departmentId, // Подставляем ID родительского департамента
    }))

  return {
    ...dept,
    id: departmentId,
    permissions: isArchived ? [] : permissions, // У заархивированного нет прав
    createdAt: creationDate.toISOString(),
    updatedAt: creationDate.toISOString(),
    archivedAt: isArchived ? new Date().toISOString() : 'false',
  }
})
