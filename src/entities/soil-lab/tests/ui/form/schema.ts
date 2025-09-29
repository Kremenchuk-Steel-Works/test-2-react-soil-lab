import z from 'zod'
import { samplesFieldRegistry } from '@/entities/soil-lab/samples/model/fields-registry'
import { samplesBaseFormSchema } from '@/entities/soil-lab/samples/ui/form/schema'
import { testsFieldRegistry } from '@/entities/soil-lab/tests/model/fields-registry'
import { TestType } from '@/shared/api/soil-lab/model'
import { zn } from '@/shared/lib/zod/zod-normalize'

const { moldingSandRecipe } = samplesFieldRegistry
const { sampleId, type, measurement1 } = testsFieldRegistry

export const testsBaseFormSchema = samplesBaseFormSchema
  .pick({
    [moldingSandRecipe.key]: true,
  } as const)
  .merge(
    z.object({
      [sampleId.key]: zn(z.string().min(1).max(50)),
      [type.key]: z.nativeEnum(TestType),
      [measurement1.key]: zn(z.number()),
    }),
  )
