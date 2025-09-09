export const PERMISSIONS = {
  ADMIN: 'admin',
  MEASUREMENTS_READ: 'measurements.read',
  MEASUREMENTS_READ_LIST: 'measurements.read_list',
  MEASUREMENTS_CREATE: 'measurements.create',
  MEASUREMENTS_UPDATE: 'measurements.update',
  MEASUREMENTS_DELETE: 'measurements.delete',
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
