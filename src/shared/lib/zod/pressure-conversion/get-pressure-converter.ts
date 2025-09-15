import { PRESSURE_CONVERSIONS, type PressureUnit } from './pressure'

type ConverterFn = (n: number) => number

// Матрица вида: from -> (to -> formula). Все типы заданы — без any.
const MATRIX: Readonly<Record<PressureUnit, Readonly<Partial<Record<PressureUnit, ConverterFn>>>>> =
  (() => {
    // Инициализируем все "from", чтобы индексирование всегда было типобезопасно.
    const init = {} as Record<PressureUnit, Partial<Record<PressureUnit, ConverterFn>>>
    for (const { from, to, formula } of PRESSURE_CONVERSIONS) {
      ;(init[from] ??= {})[to] = formula
    }
    return init
  })()

export function getPressureConverter(from: PressureUnit, to: PressureUnit): ConverterFn {
  if (from === to) return (x) => x
  const fn = MATRIX[from]?.[to] // тип: ConverterFn | undefined
  if (!fn) throw new Error(`Нет формулы для ${from} → ${to}`)
  return fn // здесь тип уже сузился до ConverterFn
}
