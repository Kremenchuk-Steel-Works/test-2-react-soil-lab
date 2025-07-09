import { z, ZodObject, ZodType, type ZodRawShape, type ZodTypeAny } from 'zod'

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
 * Тип для конфигурации динамических полей.
 * Ключ верхнего уровня - имя поля-триггера.
 * Внутренний ключ - значение поля-триггера.
 */
export type DynamicFieldConfig = Record<
  string,
  Record<
    string,
    {
      // Схема для валидации, когда триггер активирован
      schema: z.ZodObject<any>
      // Компонент для рендеринга (если он нужен рендереру)
      Component: React.ComponentType<any>
    }
  >
>

/**
 * Создает Zod-схему с поддержкой динамической валидации на основе конфига.
 * Собирает ошибки со всех полей одновременно, обходя "fail-fast" поведение Zod.
 * @param baseSchema - Базовая Zod-схема объекта.
 * @param dynamicConfig - Конфигурация правил для динамических полей.
 * @returns Финальная Zod-схема, готовая для использования в zodResolver.
 */
export function createDynamicSchema<T extends ZodObject<ZodRawShape>>(
  baseSchema: T,
  dynamicConfig: DynamicFieldConfig,
) {
  const processedSchema = z.preprocess((input, ctx) => {
    if (typeof input !== 'object' || input === null) {
      return input
    }

    // Применяем логику валидации для динамических полей
    for (const triggerFieldName in dynamicConfig) {
      // @ts-ignore - Мы знаем, что input это объект
      const triggerValue = input[triggerFieldName as keyof typeof input]

      if (typeof triggerValue !== 'string' || !triggerValue) continue

      const rules = dynamicConfig[triggerFieldName]
      const ruleForValue = rules?.[triggerValue]

      if (ruleForValue) {
        const result = ruleForValue.schema.safeParse(input)

        if (!result.success) {
          result.error.issues.forEach((issue) => {
            ctx.addIssue(issue)
          })
        }
      }
    }

    // Возвращаем оригинальный input для дальнейшей проверки базовой схемой
    return input
  }, baseSchema)

  // Оборачиваем в pipe для совместимости с react-hook-form
  return z.any().pipe(processedSchema)
}
