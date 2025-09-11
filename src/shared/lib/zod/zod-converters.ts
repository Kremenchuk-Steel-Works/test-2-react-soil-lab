import z, { type ZodType, type ZodTypeDef } from 'zod'

const NCM2_TO_KGFCM2_RATIO = 9.807

interface StrengthRangeOptions {
  min?: number
  max?: number
  round?: number
}

/**
 * Применяет к числовой схеме конвертацию, округление и валидацию диапазона.
 *
 * @param schema - Исходная схема, возвращающая число.
 * @param options - Объект с необязательными `min`, `max` и `round`.
 * @returns Финальная Zod-схема.
 */
export const withNcm2ToKgfcm2Conversion = <TDef extends ZodTypeDef, TInput>(
  schema: ZodType<number, TDef, TInput>,
  options: StrengthRangeOptions = {},
) => {
  // Устанавливаем округление по умолчанию (2 знака)
  const { min, max, round = 2 } = options

  return (
    schema
      // Конвертируем значение из Н/см² в кгс/см²
      .transform((valueInNcm) => valueInNcm / NCM2_TO_KGFCM2_RATIO)
      // Округляем результат
      .transform((convertedValue) => Number(convertedValue.toFixed(round)))
      // Валидируем финальное, округленное значение
      .superRefine((roundedValue, ctx) => {
        if (typeof roundedValue !== 'number' || Number.isNaN(roundedValue)) {
          return
        }

        const isMinOk = min === undefined || roundedValue >= min
        const isMaxOk = max === undefined || roundedValue <= max

        if (isMinOk && isMaxOk) {
          return
        }

        // Используем округленное значение в сообщении об ошибке
        const formattedValue = roundedValue.toFixed(round)
        let errorMessage = ''

        if (min !== undefined && max !== undefined) {
          errorMessage = `Значення має бути в діапазоні від ${min} до ${max}. Поточне: ${formattedValue} кгс/см²`
        } else if (min !== undefined) {
          errorMessage = `Значення має бути не менше ${min}. Поточне: ${formattedValue} кгс/см²`
        } else if (max !== undefined) {
          errorMessage = `Значення має бути не більше ${max}. Поточне: ${formattedValue} кгс/см²`
        }

        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: errorMessage,
        })
      })
  )
}
