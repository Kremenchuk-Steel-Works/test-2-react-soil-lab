import type { ComponentType } from 'react'
import { z, ZodObject, type ZodRawShape } from 'zod'
import { logger } from '@/shared/lib/logger'
import type { DynamicFieldsProps } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldsContextOld'

export const ANY_VALUE = '__ANY__'

type ConditionPrimitive = string | number
type ConditionValue = ConditionPrimitive | ConditionPrimitive[]
type ConditionsMap = Record<string, ConditionValue>

export type BaseDynamicComponentProps = object

export type DynamicComponentProps<
  TOptions extends object,
  TResponseData = unknown,
> = DynamicFieldsProps & {
  options?: TOptions
  responseData?: TResponseData
}

/** Правило с ОБЯЗАТЕЛЬНЫМ стабильным id */
export interface DynamicRule<
  TOptions extends object = object,
  TResponseData = unknown,
  RuleKey extends string = string,
> {
  id: RuleKey
  conditions: ConditionsMap
  exceptions?: ConditionsMap
  schema: z.ZodObject<any>
  Component: ComponentType<
    BaseDynamicComponentProps & {
      options?: TOptions
      responseData?: TResponseData
    }
  >
  renderTrigger?: string
  /** опционально — явно указать какие поля очищать при деактивации */
  affectedFields?: string[]
}

export type DynamicFieldConfig<RuleKey extends string = string> = ReadonlyArray<
  DynamicRule<any, any, RuleKey>
>

function valueMatchesCondition(formValue: unknown, conditionValue: ConditionValue): boolean {
  if (conditionValue === ANY_VALUE) {
    return formValue !== null && formValue !== undefined && formValue !== ''
  }
  if (Array.isArray(conditionValue)) {
    const hasValue = formValue !== null && formValue !== undefined && formValue !== ''
    return (
      (conditionValue.includes(ANY_VALUE as any) && hasValue) ||
      conditionValue.includes(formValue as ConditionPrimitive)
    )
  }
  return formValue === conditionValue
}

export function checkConditions<TOptions extends object>(
  formData: Record<string, unknown>,
  rule: DynamicRule<TOptions, unknown>,
): boolean {
  const { conditions, exceptions } = rule
  for (const fieldName in conditions) {
    logger.debug(
      `[dynamic-schema] Checking field: '${fieldName}'. Form value is:`,
      formData[fieldName],
      `Type: ${typeof formData[fieldName]}`,
    )
    if (!valueMatchesCondition(formData[fieldName], conditions[fieldName])) {
      return false
    }
  }
  if (exceptions) {
    for (const fieldName in exceptions) {
      if (valueMatchesCondition(formData[fieldName], exceptions[fieldName])) {
        return false
      }
    }
  }
  return true
}

export function createDynamicSchema<T extends ZodObject<ZodRawShape>>(
  baseSchema: T,
  dynamicConfig: DynamicFieldConfig,
) {
  const processedSchema = z.preprocess((input, ctx) => {
    if (typeof input !== 'object' || input === null) return input
    for (const rule of dynamicConfig) {
      if (checkConditions(input as Record<string, unknown>, rule)) {
        const result = rule.schema.safeParse(input)
        if (!result.success) {
          result.error.issues.forEach((issue) => ctx.addIssue(issue))
        }
      }
    }
    return input
  }, baseSchema)
  return z.any().pipe(processedSchema)
}

/** Сохраняем литеральные типы id (union) из переданного массива */
export function createFormConfig<const T extends ReadonlyArray<DynamicRule<any, any, string>>>(
  config: T,
) {
  return config
}
