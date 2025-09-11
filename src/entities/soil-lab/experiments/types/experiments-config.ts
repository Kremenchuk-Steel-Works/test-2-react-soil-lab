export const MIXTURES = {
  '13': 13,
  '14': 14,
  '15': 15,
} as const

export type MixtureKey = (typeof MIXTURES)[keyof typeof MIXTURES]

/** Нормализованный тип диапазона (min | max | both) */
export type NumericRange = { min?: number; max?: number }

/** Условная ветка: диапазон зависит от значения контекста (например температуры) */
export type ConditionalRange<TContext = number> = {
  byRange?: Array<{ when: (ctx: TContext) => boolean; range: NumericRange }>
  range?: NumericRange
  round?: { digits: number }
  differenceTreshold?: { mode: 'absolute' | 'relative'; value: number }
}

/** Универсальная конфигурация поля (для влажности, газопроницаемости, крепкости) */
export type FieldConfig<TContext = number> =
  | ConditionalRange<TContext> // диапазон с условием
  | NumericRange // просто min/max
  | number // только минимальное значение
  | { min?: number; max?: number } // min/max как объект без условий

/** Норма по смеси */
export type NormConfig<TContext = number> = Record<string, FieldConfig<TContext>>

/** Конфиг для одного типа эксперимента */
export type ExperimentTypeConfig = Partial<
  Record<
    MixtureKey,
    {
      norm: NormConfig
      round?: { digits: number }
      differenceTreshold?: { mode: 'absolute' | 'relative'; value: number }
    }
  >
>
