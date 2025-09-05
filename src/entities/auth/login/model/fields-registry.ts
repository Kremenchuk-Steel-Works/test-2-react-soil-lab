import { createFieldRegistry } from '@/utils/react-hook-form/createFieldRegistry'

export const FR_LOGIN = createFieldRegistry({
  email: {
    label: { default: 'Email' },
  },
  password: {
    label: { default: 'Пароль' },
  },
  rememberMe: {
    label: { default: `Запам'ятати мене` },
  },
} as const)
