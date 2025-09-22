import z from 'zod'
import { gasPermeabilityFieldRegistry } from '@/entities/soil-lab/experiments/gasPermeability/model/fields-registry'
import { experimentsBaseFormSchema } from '@/entities/soil-lab/experiments/ui/form/schema'
import { zn } from '@/shared/lib/zod/zod-normalize'

const { moldingSandNumber, machineType, gasPermeability } = gasPermeabilityFieldRegistry

export const gasPermeabilityBaseFormSchema = experimentsBaseFormSchema
  .pick({
    [moldingSandNumber.key]: true,
    [machineType.key]: true,
  } as const)
  .merge(
    z.object({
      [gasPermeability.key]: zn(z.number().nullable().optional()),
    }),
  )
