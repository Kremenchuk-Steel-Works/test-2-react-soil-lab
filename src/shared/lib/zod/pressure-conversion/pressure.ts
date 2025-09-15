export const PressureUnits = {
  N_PER_CM2: 'N/cm^2',
  KGF_PER_CM2: 'kgf/cm^2',
} as const

export type PressureUnit = (typeof PressureUnits)[keyof typeof PressureUnits]

type ConverterFn = (n: number) => number
type ConversionEntry = Readonly<{ from: PressureUnit; to: PressureUnit; formula: ConverterFn }>

/** Все формулы хранятся декларативно как пары { from, to, formula }. */
export const PRESSURE_CONVERSIONS = [
  { from: PressureUnits.N_PER_CM2, to: PressureUnits.KGF_PER_CM2, formula: (x) => x / 9.80665 },
  { from: PressureUnits.KGF_PER_CM2, to: PressureUnits.N_PER_CM2, formula: (x) => x * 9.80665 },
] as const satisfies readonly ConversionEntry[]
