import { z } from 'zod'

export const librarySchema = z.object({
  shortName: z.string().nonempty(),
  fullName: z.string().nonempty(),
  keywords: z.array(z.string()).nonempty(),
  file: z.instanceof(File),
})

export type LibraryFormFields = z.infer<typeof librarySchema>
