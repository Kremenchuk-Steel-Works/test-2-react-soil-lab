import { z } from 'zod'

export const coreBatchFormSchema = z.object({
  moldingSandTypeId: z.string().optional(),
  moldCoreTypeId: z.string().optional(),
  machineId: z.string().optional(),
  resinId: z.string().optional(),
  resinComponentADosage: z.string().optional(),
  resinComponentBDosage: z.string().optional(),
  triethylamineId: z.string().optional(),
  coreBatchId: z.string().optional(),
  ironOxideId: z.string().optional(),
  sandTemperature: z.string().optional(),
  controlCoreHardness: z.string().optional(),
  manufacturingTimestamp: z.string().optional(),
  batchExpiryDate: z.string().optional(),
})

export type CoreBatchFormFields = z.infer<typeof coreBatchFormSchema>
