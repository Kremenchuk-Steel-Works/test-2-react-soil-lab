import z from 'zod'
import { MEASUREMENTS as FR } from '@/entities/soil-lab/measurements/model/fields-registry'
import { Instruments, Units } from '@/shared/lib/zod/unit-conversion/unit-types'
import { withUnitConversion } from '@/shared/lib/zod/unit-conversion/withUnitConversion'
import { zn } from '@/shared/lib/zod/zod-normalize'

export const measurementsBaseFormSchema = z.object({
  [FR.moldingSandNumber.key]: zn(z.string().min(1).max(50)),
  [FR.moldingSandStrengthKgfCm2.key]: withUnitConversion(zn(z.number()), {
    from: Units.N_PER_CM2,
    to: Units.KGF_PER_CM2,
    round: 2,
    min: 0.1,
    max: 5,
  }),
  [FR.moldingSandGasPermeability.key]: withUnitConversion(zn(z.number()), {
    from: Units.SI_E8,
    to: Units.PN,
    instrument: Instruments.LPIR1,
    round: 0,
    min: 50,
    max: 250,
  }),
  [FR.moldingSandMoisturePercent.key]: zn(z.number().min(0.1).max(5)),
  [FR.note.key]: zn(z.string().min(1).max(1000).nullable().optional()),
})
