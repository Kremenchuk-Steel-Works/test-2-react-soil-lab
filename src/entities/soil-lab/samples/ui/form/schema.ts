import z from 'zod'
import { samplesFieldRegistry } from '@/entities/soil-lab/samples/model/fields-registry'
import { zn } from '@/shared/lib/zod/zod-normalize'

const { materialId, materialSourceId, temperature, receivedAt, note } = samplesFieldRegistry

export const samplesBaseFormSchema = z.object({
  [materialId.key]: zn(z.string()),
  [materialSourceId.key]: zn(z.string()),
  [temperature.key]: zn(z.number()),
  [receivedAt.key]: zn(z.string().datetime()),
  [note.key]: zn(z.string().min(1).max(1000).nullable().optional()),
})
