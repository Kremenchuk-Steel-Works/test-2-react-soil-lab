import { createFieldRegistry } from '@/utils/react-hook-form/createFieldRegistry'

export const samplesFieldRegistry = createFieldRegistry({
  moldingSandRecipe: {
    label: { default: '№ суміші' },
  },
  receivedAt: {
    label: { default: 'Створено' },
  },
  note: {
    label: { default: 'Примітка' },
  },
  tests: {
    label: { default: 'Тести' },
  },
} as const)
