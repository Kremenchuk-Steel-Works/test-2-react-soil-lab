import type { FieldValues } from 'react-hook-form'

export type ConditionValue = string | string[]
export type ConditionsMap = Record<string, ConditionValue>

// Узкий type-guard для строки
const isString = (v: unknown): v is string => typeof v === 'string'

// Узкий type-guard для объектов формата { value: string }
const hasStringValue = (v: unknown): v is { value: string } =>
  typeof v === 'object' &&
  v !== null &&
  'value' in (v as Record<string, unknown>) &&
  typeof (v as Record<string, unknown>).value === 'string'

/**
 * Проверяет, соответствует ли значение поля заданному условию.
 * @param fieldValue - Текущее значение поля.
 * @param condition - Ожидаемое значение (строка) или массив возможных значений.
 * @returns {boolean} - true, если условие выполнено.
 */
const checkValueMatch = (fieldValue: unknown, condition: ConditionValue): boolean => {
  const actualValue = hasStringValue(fieldValue) ? fieldValue.value : fieldValue

  if (Array.isArray(condition)) {
    return isString(actualValue) && condition.includes(actualValue)
  }
  return isString(actualValue) && actualValue === condition
}

/**
 * Проверяет, выполнены ли все условия в карте.
 * @param conditions - Карта условий для проверки.
 * @param formValues - Текущие значения всех полей формы.
 * @returns {boolean} - true, если ВСЕ условия выполнены.
 */
export const areConditionsMet = (conditions: ConditionsMap, formValues: FieldValues): boolean => {
  return Object.entries(conditions).every(([fieldName, conditionValue]) => {
    const fieldValue = (formValues as Record<string, unknown>)[fieldName]
    return checkValueMatch(fieldValue, conditionValue)
  })
}
