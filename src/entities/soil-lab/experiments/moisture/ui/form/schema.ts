import z from 'zod'
import { moistureFieldRegistry } from '@/entities/soil-lab/experiments/moisture/model/fields-registry'
import { zn } from '@/shared/lib/zod/zod-normalize'

const { moldingSandNumber, ambientTempMoldAssemblyArea, moistureContentPercent } =
  moistureFieldRegistry

export const moistureBaseFormSchema = z.object({
  [moldingSandNumber.key]: zn(z.string()),
  [ambientTempMoldAssemblyArea.key]: zn(z.number()),
  [moistureContentPercent.key]: zn(z.number().nullable().optional()),
})

// [moistureContentPercent.key]: withUnitConversion(zn(z.number()), {
//   from: PressureUnits.N_PER_CM2,
//   to: PressureUnits.KGF_PER_CM2,
//   min: 1,
//   max: 5,
//   round: 2,
// }),
