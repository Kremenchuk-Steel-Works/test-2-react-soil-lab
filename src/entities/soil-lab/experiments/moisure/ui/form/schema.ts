import type { DeepPartial } from 'react-hook-form'
import z from 'zod'
import { moistureFieldRegistry } from '@/entities/soil-lab/experiments/moisure/model/fields-registry'
import { PressureUnits } from '@/shared/lib/zod/pressure-conversion/pressure'
import { withUnitConversion } from '@/shared/lib/zod/pressure-conversion/withUnitConversion'
import { zn } from '@/shared/lib/zod/zod-normalize'

const { moldingSandNumber, ambientTempMoldAssemblyArea, measurements, moistureContentPercent } =
  moistureFieldRegistry

export const experimentsMeasurementFormSchema = z.object({
  [moistureContentPercent.key]: withUnitConversion(zn(z.number()), {
    from: PressureUnits.N_PER_CM2,
    to: PressureUnits.KGF_PER_CM2,
    min: 1,
    max: 5,
    round: 2,
  }),
})

export const moistureBaseFormSchema = z.object({
  [moldingSandNumber.key]: zn(z.string()),
  [ambientTempMoldAssemblyArea.key]: zn(z.number()),
  [measurements.key]: z.array(experimentsMeasurementFormSchema).min(2).max(3),
})

export type ExperimentsMeasurementFormFields = z.infer<typeof experimentsMeasurementFormSchema>

export const experimentsMeasurementFormDefaultValues: DeepPartial<ExperimentsMeasurementFormFields> =
  {}
