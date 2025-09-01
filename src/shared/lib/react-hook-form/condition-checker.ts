import type { FieldValues } from 'react-hook-form'

export type ConditionValue = string | string[]
export type ConditionsMap = Record<string, ConditionValue>

/**
 * Проверяет, соответствует ли значение поля заданному условию.
 * @param fieldValue - Текущее значение поля.
 * @param condition - Ожидаемое значение (строка) или массив возможных значений.
 * @returns {boolean} - true, если условие выполнено.
 */
const checkValueMatch = (fieldValue: unknown, condition: ConditionValue): boolean => {
  const actualValue = (fieldValue as { value: string })?.value ?? fieldValue

  if (Array.isArray(condition)) {
    return condition.includes(actualValue)
  }
  return actualValue === condition
}

/**
 * Проверяет, выполнены ли все условия в карте.
 * @param conditions - Карта условий для проверки.
 * @param formValues - Текущие значения всех полей формы.
 * @returns {boolean} - true, если ВСЕ условия выполнены.
 */
export const areConditionsMet = (conditions: ConditionsMap, formValues: FieldValues): boolean => {
  // `every` реализует логику "И" — все условия должны быть истинными.
  return Object.entries(conditions).every(([fieldName, conditionValue]) => {
    const fieldValue = formValues[fieldName]
    return checkValueMatch(fieldValue, conditionValue)
  })
}
