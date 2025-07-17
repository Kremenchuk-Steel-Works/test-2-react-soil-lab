import { z, ZodObject, ZodType, type ZodRawShape, type ZodTypeAny } from 'zod'
import type { DynamicFieldsProps } from '@/shared/ui/forms/DynamicFieldsRenderer'

export default function optionalObject<T extends ZodTypeAny>(
  schema: T,
): ZodType<z.infer<T> | undefined> {
  return z.preprocess(
    (val) => {
      // Если все поля пустые – возвращаем undefined
      if (
        val &&
        typeof val === 'object' &&
        !Array.isArray(val) &&
        Object.values(val).every((v) => v === undefined || v === '')
      ) {
        return undefined
      }
      return val
    },
    z.union([schema, z.undefined()]),
  )
}

export const parseNumber = (v: unknown) =>
  v === '' || v === null || v === undefined ? undefined : Number(v)

export const toZodEnumValues = <T extends readonly { value: string }[]>(options: T) =>
  options.map((o) => o.value) as [T[number]['value'], ...T[number]['value'][]]

/**
 * Условие для активации правила.
 * Может быть строкой (точное совпадение) или массивом строк (любое из значений).
 */
type ConditionValue = string | string[]

/**
 * Карта условий, где ключ - имя поля, а значение - требуемое значение или массив значений.
 * Правило сработает, если ВСЕ условия в карте будут выполнены (логика "И").
 */
type ConditionsMap = Record<string, ConditionValue>

// TOptions - это объект, описывающий, какие options доступны (например, { organizationsOptions: Option[] })
export type DynamicComponentProps<TOptions extends object> = DynamicFieldsProps & {
  options: TOptions
}

/**
 * Описание одного динамического правила.
 */
export interface DynamicRule<TOptions extends object> {
  // Условия, при которых правило активно
  conditions: ConditionsMap
  // Исключения, при которых правило НЕ активно, даже если условия совпали (логика "И")
  exceptions?: ConditionsMap
  // Схема для валидации, когда правило активно
  schema: z.ZodObject<any>
  // Компонент для рендеринга, когда правило активно
  Component: React.ComponentType<DynamicComponentProps<TOptions>>
  renderTrigger?: string
}

/**
 * Тип для конфигурации динамических полей.
 */
export type DynamicFieldConfig<TOptions extends object> = DynamicRule<TOptions>[]

/**
 * Проверяет, соответствует ли значение поля указанному условию.
 * @param formValue - Значение из формы.
 * @param conditionValue - Условие из конфига (строка или массив строк).
 * @returns boolean
 */
function valueMatchesCondition(formValue: unknown, conditionValue: string | string[]): boolean {
  if (Array.isArray(conditionValue)) {
    // Для массива проверяем вхождение
    return typeof formValue === 'string' && conditionValue.includes(formValue)
  }
  // Для строки проверяем точное совпадение
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
export function createDynamicSchema<T extends ZodObject<ZodRawShape>, TOptions extends object>(
  baseSchema: T,
  dynamicConfig: DynamicFieldConfig<TOptions>,
) {
  // <- Используем Generic
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

  return z.any().pipe(processedSchema)
}

export function createFormConfig<TOptions extends object>(config: DynamicFieldConfig<TOptions>) {
  return config
}
