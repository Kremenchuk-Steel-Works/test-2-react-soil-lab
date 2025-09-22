import { PERMEABILITY_CONVERSIONS, PermeabilityUnits, type PermeabilityUnit } from './permeability'
import {
  PRESSURE_CONVERSIONS,
  PressureUnits,
  type ConversionEntry,
  type PressureUnit,
} from './pressure'

export type Unit = PressureUnit | PermeabilityUnit

/** Общий словарь */
export const Units = {
  ...PressureUnits,
  ...PermeabilityUnits,
} as const

/** Единый список всех формул конверсий */
export const ALL_CONVERSIONS = [
  ...PRESSURE_CONVERSIONS,
  ...PERMEABILITY_CONVERSIONS,
] as const satisfies readonly ConversionEntry<Unit>[]
