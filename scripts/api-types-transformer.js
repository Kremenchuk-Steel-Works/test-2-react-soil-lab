/**
 * Хелпер для конвертации snake_case в camelCase.
 * @param {string} s - Строка в snake_case.
 * @returns {string} - Строка в camelCase.
 */
function snakeToCamel(s) {
  return s.replace(/(_\w)/g, (m) => m[1].toUpperCase())
}

/**
 * Рекурсивная функция для обхода всей схемы OpenAPI.
 * Она ищет объекты `properties` и конвертирует их ключи в camelCase.
 * @param {any} node - Текущий узел в дереве схемы (объект, массив или примитив).
 */
function walk(node) {
  // Если узел не объект (или null), выходим
  if (typeof node !== 'object' || node === null) {
    return
  }

  // Если узел - это массив, рекурсивно обходим каждый его элемент
  if (Array.isArray(node)) {
    for (const item of node) {
      walk(item)
    }
    return
  }

  // Если у текущего объекта есть поле 'properties', трансформируем его ключи
  if ('properties' in node && typeof node.properties === 'object') {
    const newProperties = {}
    for (const key in node.properties) {
      const newKey = snakeToCamel(key)
      newProperties[newKey] = node.properties[key]
    }
    node.properties = newProperties
  }

  // Рекурсивно обходим все дочерние ключи текущего объекта
  for (const key in node) {
    if (Object.prototype.hasOwnProperty.call(node, key)) {
      walk(node[key])
    }
  }
}

/**
 * Главная функция-трансформер, которую вызывает openapi-typescript.
 * @param {object} schema - Исходная OpenAPI схема.
 * @returns {object} - Трансформированная схема.
 */
module.exports = async (schema) => {
  // Запускаем рекурсивный обход со всего объекта схемы
  walk(schema)
  return schema
}
