import { Instruments, Units } from '@/shared/lib/zod/unit-conversion/unit-registry'
import type { UnitConversionConfig } from '@/shared/lib/zod/unit-conversion/unit-types'

/** База: чистая конверсия единиц (для отчётности/СИ) */
const CM3_TO_M3 = 1e-6
const CM_TO_M = 1e-2
const CM2_TO_M2 = 1e-4
const GF_PER_CM2_TO_PA = 98.0665
const MIN_TO_S = 60

export const PN_PER_SI = 1 / ((CM3_TO_M3 * CM_TO_M) / (CM2_TO_M2 * GF_PER_CM2_TO_PA * MIN_TO_S)) // = 58_839_900
export const PN_PER_SI_E8 = PN_PER_SI * 1e-8 // ≈ 0.588399

/** ---------------- LPiR-1: piecewise профиль по лабораторной таблице ---------------- */
type Row = Readonly<{ ke8: number; pn: number }>

const SI_E8_LPIR1_TABLE: readonly Row[] = [
  { ke8: 70, pn: 45 },
  { ke8: 75, pn: 48 },
  { ke8: 80, pn: 51 },
  { ke8: 85, pn: 54 },
  { ke8: 90, pn: 57 },
  { ke8: 95, pn: 60 },
  { ke8: 100, pn: 63 },
  { ke8: 105, pn: 65 },
  { ke8: 110, pn: 69 },
  { ke8: 115, pn: 71 },
  { ke8: 120, pn: 75 },
  { ke8: 125, pn: 77 },
  { ke8: 130, pn: 80 },
  { ke8: 135, pn: 83 },
  { ke8: 140, pn: 86 },
  { ke8: 145, pn: 89 },
  { ke8: 150, pn: 91 },
  { ke8: 155, pn: 94 },
  { ke8: 160, pn: 97 },
  { ke8: 165, pn: 100 },
  { ke8: 170, pn: 103 },
  { ke8: 175, pn: 106 },
  { ke8: 180, pn: 109 },
  { ke8: 185, pn: 113 },
  { ke8: 190, pn: 116 },
  { ke8: 195, pn: 118 },
  { ke8: 200, pn: 120 },
  { ke8: 205, pn: 123 },
  { ke8: 210, pn: 126 },
  { ke8: 215, pn: 129 },
  { ke8: 220, pn: 132 },
  { ke8: 225, pn: 135 },
  { ke8: 230, pn: 139 },
  { ke8: 235, pn: 142 },
  { ke8: 240, pn: 145 },
  { ke8: 245, pn: 148 },
  { ke8: 250, pn: 151 },
  { ke8: 255, pn: 154 },
  { ke8: 260, pn: 157 },
  { ke8: 265, pn: 160 },
  { ke8: 270, pn: 162 },
  { ke8: 275, pn: 165 },
  { ke8: 280, pn: 167 },
  { ke8: 285, pn: 170 },
  { ke8: 290, pn: 173 },
  { ke8: 295, pn: 176 },
  { ke8: 300, pn: 179 },
  { ke8: 305, pn: 182 },
] as const

function assertMonotone(rows: readonly Row[]): void {
  for (let i = 1; i < rows.length; i += 1) {
    if (!(rows[i].ke8 > rows[i - 1].ke8 && rows[i].pn > rows[i - 1].pn)) {
      throw new Error('SI_E8_LPIR1_TABLE must be strictly increasing')
    }
  }
}
assertMonotone(SI_E8_LPIR1_TABLE)

function lerp(x0: number, y0: number, x1: number, y1: number, x: number): number {
  const t = (x - x0) / (x1 - x0)
  return y0 + t * (y1 - y0)
}

function makePiecewise(
  xs: readonly number[],
  ys: readonly number[],
): { fwd: (x: number) => number; inv: (y: number) => number } {
  const n = xs.length

  const fwd = (x: number): number => {
    if (n === 0) return Number.NaN
    if (n === 1) return ys[0]
    // Экстраполяция по крайним сегментам
    if (x <= xs[0]) return lerp(xs[0], ys[0], xs[1], ys[1], x)
    if (x >= xs[n - 1]) return lerp(xs[n - 2], ys[n - 2], xs[n - 1], ys[n - 1], x)
    // Двоичный поиск сегмента
    let lo = 0
    let hi = n - 1
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1
      if (xs[mid] <= x) lo = mid
      else hi = mid
    }
    return lerp(xs[lo], ys[lo], xs[hi], ys[hi], x)
  }

  const inv = (y: number): number => {
    if (n === 0) return Number.NaN
    if (n === 1) return xs[0]
    if (y <= ys[0]) return lerp(ys[0], xs[0], ys[1], xs[1], y)
    if (y >= ys[n - 1]) return lerp(ys[n - 2], xs[n - 2], ys[n - 1], xs[n - 1], y)
    let lo = 0
    let hi = n - 1
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1
      if (ys[mid] <= y) lo = mid
      else hi = mid
    }
    return lerp(ys[lo], xs[lo], ys[hi], xs[hi], y)
  }

  return { fwd, inv }
}

const SI_E8_LPIR1_XS = SI_E8_LPIR1_TABLE.map((r) => r.ke8) as readonly number[]
const SI_E8_LPIR1_YS = SI_E8_LPIR1_TABLE.map((r) => r.pn) as readonly number[]
const { fwd: SI_E8_TO_PN_LPIR1, inv: PN_TO_SI_E8_LPIR1 } = makePiecewise(
  SI_E8_LPIR1_XS,
  SI_E8_LPIR1_YS,
)

/**
 * Публичные конверсии:
 *  — SI<->PN и SI<->SI_E8: чистые единицы
 *  — SI_E8<->PN: piecewise для конкретного прибора (LPiR-1), с метаданными instrument
 */
export const PERMEABILITY_CONVERSIONS = [
  // SI <-> PN (размерности)
  { from: Units.SI, to: Units.PN, formula: (x) => x * PN_PER_SI },
  { from: Units.PN, to: Units.SI, formula: (x) => x / PN_PER_SI },

  // SI <-> SI_E8 (масштаб)
  { from: Units.SI_E8, to: Units.SI, formula: (x) => x * 1e-8 },
  { from: Units.SI, to: Units.SI_E8, formula: (x) => x * 1e8 },

  // SI_E8 <-> PN (LPIR-1)
  {
    from: Units.SI_E8,
    to: Units.PN,
    formula: (x) => SI_E8_TO_PN_LPIR1(x),
    instrument: Instruments.LPIR1,
  },
  {
    from: Units.PN,
    to: Units.SI_E8,
    formula: (x) => PN_TO_SI_E8_LPIR1(x),
    instrument: Instruments.LPIR1,
  },
] as const satisfies UnitConversionConfig[]
