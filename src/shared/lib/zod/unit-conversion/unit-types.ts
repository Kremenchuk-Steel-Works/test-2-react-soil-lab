import type { Instruments, Units } from '@/shared/lib/zod/unit-conversion/unit-registry'
import type { ValueOf } from '@/types/utility'

export type Unit = ValueOf<typeof Units>
export type Instrument = ValueOf<typeof Instruments>

export type ConverterFn = (n: number) => number

/** Универсальный конфиг формулы с опциональным прибором */
export type UnitConversionConfig = Readonly<{
  from: Unit
  to: Unit
  formula: ConverterFn
  instrument?: Instrument | Instrument[]
}>
