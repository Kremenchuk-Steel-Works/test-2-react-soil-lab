import { z } from 'zod'

export const moldExperimentFormSchema = z.object({
  documentId: z.string().optional(),
  workDescription: z.string().optional(),
  notes: z.string().optional(),
})

export type MoldExperimentFormFields = z.infer<typeof moldExperimentFormSchema>
