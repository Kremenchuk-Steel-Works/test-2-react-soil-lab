export const PERMISSIONS = {
  ADMIN: 'admin',
  QUALITY_DASH_VIEW: 'quality_dash:view',
  CALCULATOR_VIEW: 'calculator:view',
  NDT_DOCUMENTS_VIEW: 'ndt_documents:view',
  MATERIAL_CALCULATOR_VIEW: 'material_calculator:view',
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
