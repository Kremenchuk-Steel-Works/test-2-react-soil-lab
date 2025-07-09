import { z } from 'zod'
import {
  FemaleSpecificFields,
  MaleSpecificFields,
} from '@/entities/mold-passport/mold-passport/forms/components/GenderSpecificFields'
import {
  Maksim2SpecificFields,
  MaksimSpecificFields,
} from '@/entities/mold-passport/mold-passport/forms/components/NameSpecificFields'
import type { DynamicFieldConfig } from '@/shared/lib/zod'

export const moldPassportDynamicFieldConfig: DynamicFieldConfig = {
  // Правила, зависящие от поля 'gender'
  gender: {
    male: {
      schema: z.object({
        militaryId: z.string().nonempty(),
      }),
      Component: MaleSpecificFields,
    },
    female: {
      schema: z.object({
        maidenName: z.string().optional(),
        militaryId: z.string().optional(),
      }),
      Component: FemaleSpecificFields,
    },
  },
  // Правила, зависящие от поля 'firstName'
  firstName: {
    Максим: {
      schema: z.object({
        identifier: z.string().nonempty(),
        letterCount: z.number(),
      }),
      Component: MaksimSpecificFields,
    },
    'Максим 2': {
      schema: z.object({
        identifier: z.string().optional(),
      }),
      Component: Maksim2SpecificFields,
    },
  },
}
