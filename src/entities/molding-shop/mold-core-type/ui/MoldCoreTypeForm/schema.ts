import { z } from 'zod'

export const moldCoreTypeFormSchema = z.object({
  castingPatternId: z.string().optional(),
  modelNumber: z.string().optional(),
  inventoryBoxNumber: z.string().optional(),
  shelfLifeDays: z.string().optional(),
})

export type MoldCoreTypeFormFields = z.infer<typeof moldCoreTypeFormSchema>
