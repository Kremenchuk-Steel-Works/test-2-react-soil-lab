import z from 'zod'
import { experimentsFieldRegistry } from '@/entities/soil-lab/experiments/model/fields-registry'
import { Instruments, Units } from '@/shared/lib/zod/unit-conversion/unit-types'
import { withUnitConversion } from '@/shared/lib/zod/unit-conversion/withUnitConversion'
import { zn } from '@/shared/lib/zod/zod-normalize'

const { moldingSandNumber, ambientTempMoldAssemblyArea, machineType } = experimentsFieldRegistry

export const experimentsBaseFormSchema = z.object({
  [moldingSandNumber.key]: zn(z.string()),
  [machineType.key]: zn(z.string()),
  [ambientTempMoldAssemblyArea.key]: withUnitConversion(zn(z.number()), {
    from: Units.SI_E8,
    to: Units.PN,
    instrument: Instruments.LPIR1,
    min: 100,
    round: 0,
  }),
})

export type ExperimentsBaseFormFields = z.infer<typeof experimentsBaseFormSchema>
