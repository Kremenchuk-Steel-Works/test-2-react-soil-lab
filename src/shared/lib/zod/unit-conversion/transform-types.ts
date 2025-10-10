import type { Instrument, Unit } from '@/shared/lib/zod/unit-conversion/unit-types'

export type TransformContext = Readonly<{ instrument?: Instrument }>

/**
 * Спецификация трансформации.
 * compute - метод (bi-variance по параметрам).
 */
export type TransformSpec<TArgs extends Record<string, number>> = Readonly<{
  id: string
  inputs: readonly (keyof TArgs & string)[]
  compute(args: TArgs, ctx: TransformContext): number
  unit: Unit
}>
