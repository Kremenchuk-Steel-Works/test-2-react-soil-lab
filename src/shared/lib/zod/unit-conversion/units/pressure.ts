export const PressureUnits = {
  N_PER_CM2: 'Н/см²',
  KGF_PER_CM2: 'кгс/см²',
} as const
export type PressureUnit = (typeof PressureUnits)[keyof typeof PressureUnits]

type ConverterFn = (n: number) => number
export type ConversionEntry<U extends string> = Readonly<{ from: U; to: U; formula: ConverterFn }>

export const PRESSURE_CONVERSIONS = [
  { from: PressureUnits.N_PER_CM2, to: PressureUnits.KGF_PER_CM2, formula: (x) => x / 9.80665 },
  { from: PressureUnits.KGF_PER_CM2, to: PressureUnits.N_PER_CM2, formula: (x) => x * 9.80665 },
] as const satisfies readonly ConversionEntry<PressureUnit>[]
