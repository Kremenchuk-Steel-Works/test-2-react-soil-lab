import type { Unit } from './unit-types'
import type { ALL_CONVERSIONS } from './units'

type Conversions = typeof ALL_CONVERSIONS

type WithInstrument = Extract<Conversions[number], { instrument: unknown }>
type PairFrom<C> = C extends { from: infer F; to: infer T } ? `${F & Unit}→${T & Unit}` : never

/** Автоматически сгенерированный union пар, требующих instrument */
export type RequireInstrumentPairs = PairFrom<WithInstrument>
