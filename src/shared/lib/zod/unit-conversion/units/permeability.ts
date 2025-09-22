export const PermeabilityUnits = {
  SI: 'm²/Pa·s',
  SI_E8: '10⁻⁸ m²/Pa·s',
  PN: 'од.',
} as const
export type PermeabilityUnit = (typeof PermeabilityUnits)[keyof typeof PermeabilityUnits]

type ConverterFn = (n: number) => number
export type ConversionEntry<U extends string> = Readonly<{ from: U; to: U; formula: ConverterFn }>

export const PN_PER_SI = 58_839_900

export const PN_PER_SI_E8 = PN_PER_SI * 1e-8

export const PERMEABILITY_CONVERSIONS = [
  // SI <-> PN
  { from: PermeabilityUnits.SI, to: PermeabilityUnits.PN, formula: (x) => x * PN_PER_SI },
  { from: PermeabilityUnits.PN, to: PermeabilityUnits.SI, formula: (x) => x / PN_PER_SI },

  // SI <-> SI_E8 (просто масштаб)
  { from: PermeabilityUnits.SI_E8, to: PermeabilityUnits.SI, formula: (x) => x * 1e-8 },
  { from: PermeabilityUnits.SI, to: PermeabilityUnits.SI_E8, formula: (x) => x * 1e8 },

  // SI_E8 <-> PN (короткий путь без промежуточного SI)
  {
    from: PermeabilityUnits.SI_E8,
    to: PermeabilityUnits.PN,
    formula: (x) => x * PN_PER_SI_E8,
  },
  {
    from: PermeabilityUnits.PN,
    to: PermeabilityUnits.SI_E8,
    formula: (x) => x / PN_PER_SI_E8,
  },
] as const satisfies readonly ConversionEntry<PermeabilityUnit>[]
