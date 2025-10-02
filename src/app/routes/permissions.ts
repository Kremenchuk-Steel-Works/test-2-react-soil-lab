export const PERMISSIONS = {
  ADMIN: 'admin',
  SAMPLES_READ: 'samples.read',
  SAMPLES_CREATE: 'samples.create',
  SAMPLES_DELETE: 'samples.delete',
  TESTS_READ: 'tests.read',
  TESTS_CREATE: 'tests.create',
  TESTS_DELETE: 'tests.delete',
} as const

/**
 * PermissionCode — статический "контракт фронта": какие коды мы
 * используем в своем коде (в routes, компонентах, фичах).
 * Это union: 'quality_dash:view' | 'calculator:view' | ...
 */
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

/**
 * PermissionSet — runtime-набор прав конкретного пользователя.
 * Берем "как есть" из бекенда, не фильтруем по локальному справочнику,
 * чтобы переживать добавления прав без деплоя фронта.
 */
export type PermissionSet = ReadonlySet<string>
