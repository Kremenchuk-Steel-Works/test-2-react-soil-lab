import z from 'zod'
import { experimentsFieldRegistry } from '@/entities/soil-lab/experiments/model/fields-registry'
import { zn } from '@/shared/lib/zod/zod-normalize'

const { moldingSandNumber, ambientTempMoldAssemblyArea, machineType } = experimentsFieldRegistry

export const experimentsBaseFormSchema = z.object({
  [moldingSandNumber.key]: zn(z.string()),
  [ambientTempMoldAssemblyArea.key]: zn(z.number()),
  [machineType.key]: zn(z.string()),
})

export type ExperimentsBaseFormFields = z.infer<typeof experimentsBaseFormSchema>
