import type { PositionBase } from '@/entities/admin/positions/types/base.model'
import type { PositionDetailResponse } from '@/entities/admin/positions/types/response.dto'

const basePositions: PositionBase[] = [
  {
    name: 'Software Engineer',
    description: 'Разработка и поддержка основного продукта.',
  },
  {
    name: 'Project Manager',
    description: 'Управление проектами и командами разработки.',
  },
  {
    name: 'UI/UX Designer',
    // Должность без описания для проверки опциональности поля
  },
  {
    name: 'QA Engineer',
    description: 'Обеспечение качества и тестирование продукта.',
  },
  {
    name: 'Lead Software Engineer (Archived)',
    description: 'Устаревшая должность, заменена на Team Lead.',
  },
]

export const mockPositions: PositionDetailResponse[] = Array.from(
  { length: basePositions.length },
  (_, i) => {
    const creationDate = new Date()
    creationDate.setDate(creationDate.getDate() - i * 5) // Смещаем даты для разнообразия

    const isArchived = basePositions[i].name.includes('(Archived)')

    return {
      id: `pos-id-${i + 1}`,
      ...basePositions[i],
      createdAt: creationDate.toISOString(),
      updatedAt: creationDate.toISOString(),
      archivedAt: isArchived ? new Date().toISOString() : 'false',
    }
  },
)
