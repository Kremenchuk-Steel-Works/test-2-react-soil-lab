import { ALL_CONVERSIONS, type Unit } from './units'

type ConverterFn = (n: number) => number

// from -> (to -> formula)
const MATRIX: Readonly<Record<Unit, Readonly<Partial<Record<Unit, ConverterFn>>>>> = (() => {
  const init = {} as Record<Unit, Partial<Record<Unit, ConverterFn>>>
  for (const { from, to, formula } of ALL_CONVERSIONS) {
    ;(init[from] ??= {})[to] = formula
  }
  return init
})()

export function getUnitConverter(from: Unit, to: Unit): ConverterFn {
  if (from === to) return (x) => x
  const fn = MATRIX[from]?.[to]
  if (!fn) throw new Error(`Нет формулы для ${from} → ${to}`)
  return fn
}
