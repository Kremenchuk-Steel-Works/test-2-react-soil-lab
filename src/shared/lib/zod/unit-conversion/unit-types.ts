import type { ValueOf } from '@/types/utility'

/** Общий словарь единиц */
export const Units = {
  // Pressure
  N_PER_CM2: 'Н/см²',
  KGF_PER_CM2: 'кгс/см²',
  // Permability
  SI: 'm²/Pa·s',
  SI_E8: '10⁻⁸ m²/Pa·s',
  PN: 'од.',
} as const

/** Общий реестр приборов */
export const Instruments = {
  // Permability
  LPIR1: 'LPiR-1',
} as const

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
