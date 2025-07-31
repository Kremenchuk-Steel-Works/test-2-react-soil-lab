import { z } from 'zod'

export const coreMakingMachineFormSchema = z.object({
  brand: z.string().optional(),
  model: z.string().optional(),
})

export type CoreMakingMachineFormFields = z.infer<typeof coreMakingMachineFormSchema>
