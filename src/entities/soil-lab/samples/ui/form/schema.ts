import z from 'zod'
import { samplesFieldRegistry } from '@/entities/soil-lab/samples/model/fields-registry'
import { zn } from '@/shared/lib/zod/zod-normalize'

const { moldingSandRecipe, receivedAt, note } = samplesFieldRegistry

export const samplesBaseFormSchema = z.object({
  [moldingSandRecipe.key]: zn(z.string().min(1).max(50)),
  [receivedAt.key]: zn(z.string().datetime()),
  [note.key]: zn(z.string().min(1).max(1000).nullable().optional()),
})
