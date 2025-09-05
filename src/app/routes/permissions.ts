export const PERMISSIONS = {
  ADMIN: 'admin',
  SOIL_LAB_VIEW: 'soil_lab:view',
  SOIL_LAB_UPDATE: 'soil_lab:update',
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
