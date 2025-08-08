import type { ComponentType } from 'react'
import { z, ZodObject, type ZodRawShape } from 'zod'
import type { DynamicFieldsProps } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldsContext'

export const ANY_VALUE = '__ANY__'

/**
 * Условие для активации правила.
 * Может быть строкой (точное совпадение) или массивом строк (любое из значений).
 */
type ConditionPrimitive = string | number
type ConditionValue = ConditionPrimitive | ConditionPrimitive[]

/**
 * Карта условий, где ключ - имя поля, а значение - требуемое значение или массив значений.
 * Правило сработает, если ВСЕ условия в карте будут выполнены (логика "И").
 */
type ConditionsMap = Record<string, ConditionValue>
// TOptions - это объект, описывающий, какие options доступны (например, { organizationsOptions: Option[] })

export type DynamicComponentProps<
  TOptions extends object,
  TResponseData = unknown,
> = DynamicFieldsProps & {
  options?: TOptions
  responseData?: TResponseData
}

export type BaseDynamicComponentProps = object

/**
 * Описание одного динамического правила.
 */
export interface DynamicRule<TOptions extends object = object, TResponseData = unknown> {
  conditions: ConditionsMap
  exceptions?: ConditionsMap
  schema: z.ZodObject<any>
  // Компонент теперь ожидает пропсы, которые включают его собственные TOptions и TResponseData
  Component: ComponentType<
    BaseDynamicComponentProps & {
      options?: TOptions
      responseData?: TResponseData
    }
  >
  renderTrigger?: string
}

/**
 * Тип для конфигурации динамических полей.
 */
export type DynamicFieldConfig = ReadonlyArray<DynamicRule<any, any>>

/**
 * Проверяет, соответствует ли значение поля указанному условию.
 * @param formValue - Значение из формы.
 * @param conditionValue - Условие из конфига (строка, число или массив).
 * @returns boolean
 */
function valueMatchesCondition(formValue: unknown, conditionValue: ConditionValue): boolean {
  if (conditionValue === ANY_VALUE) {
    // Считаем условие выполненным, если значение не null, не undefined и не пустая строка
    return formValue !== null && formValue !== undefined && formValue !== ''
  }

  if (Array.isArray(conditionValue)) {
    // Проверяем, есть ли у поля в форме значение (не null, не undefined, не пустая строка)
    const formHasValue = formValue !== null && formValue !== undefined && formValue !== ''

    // Условие считается выполненным, если:
    // Массив содержит ANY_VALUE и в поле формы есть какое-либо значение.
    // ИЛИ
    // Массив содержит точное значение из поля формы.
    return (
      (conditionValue.includes(ANY_VALUE) && formHasValue) ||
      conditionValue.includes(formValue as ConditionPrimitive)
    )
  }

  // Прямое строгое сравнение (===) отлично работает и для чисел, и для строк
  return formValue === conditionValue
}

/**
 * Проверяет, удовлетворяют ли данные формы условиям и исключениям правила.
 * @param formData - текущие данные формы
 * @param rule - правило для проверки
 * @returns boolean
 */
export function checkConditions<TOptions extends object>(
  formData: Record<string, unknown>,
  rule: DynamicRule<TOptions>,
): boolean {
  const { conditions, exceptions } = rule

  // Проверяем основные условия (логика "И")
  // Если хотя бы одно условие не выполнено, правило неактивно.
  for (const fieldName in conditions) {
    console.log(
      `[Debug] Checking field: '${fieldName}'. Form value is:`,
      formData[fieldName],
      `Type: ${typeof formData[fieldName]}`,
    )
    if (!valueMatchesCondition(formData[fieldName], conditions[fieldName])) {
      return false
    }
  }

  // Если есть исключения, проверяем их (логика "И")
  // Если хотя бы одно исключение сработало, правило неактивно.
  if (exceptions) {
    for (const fieldName in exceptions) {
      if (valueMatchesCondition(formData[fieldName], exceptions[fieldName])) {
        // Нашли совпадение с исключением, значит правило нужно деактивировать.
        return false
      }
    }
  }

  // Если все условия выполнены и ни одно исключение не сработало, правило активно.
  return true
}

/**
 * Создает Zod-схему с поддержкой сложных динамических правил.
 */
export function createDynamicSchema<T extends ZodObject<ZodRawShape>>(
  baseSchema: T,
  dynamicConfig: DynamicFieldConfig,
) {
  const processedSchema = z.preprocess((input, ctx) => {
    if (typeof input !== 'object' || input === null) {
      return input
    }

    // Проходим по каждому правилу в конфиге
    for (const rule of dynamicConfig) {
      // Проверяем, активны ли условия для этого правила
      if (checkConditions(input as Record<string, unknown>, rule)) {
        // Если да, применяем его схему валидации
        const result = rule.schema.safeParse(input)
        if (!result.success) {
          result.error.issues.forEach((issue) => {
            ctx.addIssue(issue)
          })
        }
      }
    }

    return input
  }, baseSchema)
  // Оборачиваем в .pipe(z.any()) для корректной работы refine/superRefine с preprocess
  return z.any().pipe(processedSchema)
}

/**
 * Фабрика для создания конфига динамических полей.
 * Нужна для улучшения type inference в проекте.
 */
export function createFormConfig<TConfig extends DynamicFieldConfig>(config: TConfig) {
  return config
}
