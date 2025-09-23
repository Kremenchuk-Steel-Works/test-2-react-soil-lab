import { type ZodType, type ZodTypeDef } from 'zod'
import { Units, type Instrument, type Unit } from '@/shared/lib/zod/unit-conversion/unit-types'
import { getUnitConverter } from './get-unit-converter'
import { withNumberConversion, type Range } from './number-conversion'

// Парные строковые литералы вида "from→to"
type Pair<F extends Unit, T extends Unit> = `${F}→${T}`

// Карта пар, которые требуют instrument
type RequireInstrumentPairs =
  | `${typeof Units.SI_E8}→${typeof Units.PN}`
  | `${typeof Units.PN}→${typeof Units.SI_E8}`

// Хелпер-предикат
type RequiresInstrument<F extends Unit, T extends Unit> =
  Pair<F, T> extends RequireInstrumentPairs ? true : false

// Базовые опции
type BaseOptions<F extends Unit, T extends Unit> = Range & {
  from: F
  to: T
  round?: number
}

// Итоговые опции: с обязательным или опциональным instrument
export type UnitConversionOptions<F extends Unit, T extends Unit> =
  RequiresInstrument<F, T> extends true
    ? BaseOptions<F, T> & { instrument: Instrument }
    : BaseOptions<F, T> & { instrument?: Instrument }

/** Единый враппер для любых поддерживаемых единиц */
export function withUnitConversion<TDef extends ZodTypeDef, TIn, F extends Unit, T extends Unit>(
  schema: ZodType<number, TDef, TIn>,
  opts: UnitConversionOptions<F, T>,
): ZodType<number, ZodTypeDef, TIn> {
  const { from, to, min, max, round = 2, instrument } = opts

  const convert = getUnitConverter(from, to, { instrument })
  return withNumberConversion(schema, convert, {
    round,
    range: { min, max },
    unit: to,
  })
}
