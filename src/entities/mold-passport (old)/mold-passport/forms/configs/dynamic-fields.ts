import { z } from 'zod'
import { CombinedMaksymFields } from '@/entities/mold-passport (old)/mold-passport/forms/components/CombinedMaksymFields'
import {
  FemaleSpecificFields,
  MaleSpecificFields,
} from '@/entities/mold-passport (old)/mold-passport/forms/components/GenderSpecificFields'
import { MaksimSpecificFields } from '@/entities/mold-passport (old)/mold-passport/forms/components/NameSpecificFields'
import { createFormConfig } from '@/shared/lib/zod/dynamic-schema'
import type { Option, SelectOptions } from '@/shared/ui/select/ReactSelect'

export interface MoldPassportDynamicFieldOptionsOld {
  organizationsOptions: Option<string>[]
  positionsOptions: Option<string>[]
  loadAsyncOrganizationOptions: SelectOptions<Option<string>>
}

export const moldPassportDynamicFieldConfigOld =
  createFormConfig<MoldPassportDynamicFieldOptionsOld>([
    // Для мужчин (gender: 'male')
    {
      conditions: {
        gender: 'male',
      },
      schema: z.object({
        militaryId: z.string().nonempty('Вкажіть номер військового квитка'),
        test: z.array(z.string()).nonempty(),
      }),
      Component: MaleSpecificFields,
    },
    // Для женщин (gender: 'female')
    {
      conditions: {
        gender: 'female',
      },
      schema: z.object({
        militaryId: z.string().optional(),
        maidenName: z.string().optional(),
        test: z.array(z.string()).nonempty(),
      }),
      Component: FemaleSpecificFields,
    },
    // Имя 'Максим'
    {
      conditions: {
        firstName: 'Максим',
      },
      schema: z.object({
        identifier: z.string().nonempty(),
        letterCount: z.number().optional(),
      }),
      Component: MaksimSpecificFields,
    },
    // Имя 'Максим', фамилия 'Максимов' И пол 'male'
    {
      renderTrigger: 'gender',
      conditions: {
        firstName: 'Максим',
        lastName: 'Максимов',
        gender: ['male', 'other'],
      },
      schema: z.object({
        maidenName: z.string().optional(),
      }),
      Component: CombinedMaksymFields,
    },
  ])
