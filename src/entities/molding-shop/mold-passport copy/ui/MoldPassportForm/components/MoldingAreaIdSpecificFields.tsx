import { Controller } from 'react-hook-form'
import type { MoldPassportDynamicFieldOptions } from '@/entities/molding-shop/mold-passport/ui/MoldPassportForm/configs/dynamic-fields'
import { getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
import type { DynamicComponentProps } from '@/shared/lib/zod/dynamic-schema'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'

type DynamicFieldsProps = DynamicComponentProps<MoldPassportDynamicFieldOptions>

export function GreenSandCastingSpecificFields({ control, errors, options }: DynamicFieldsProps) {
  return (
    <Controller
      name="castingTechnologyId"
      control={control}
      render={({ field, fieldState }) => (
        <FormSelectField
          field={field}
          fieldState={fieldState}
          options={options.addressOptions}
          isVirtualized
          isClearable
          placeholder="Технологія формовки"
          errorMessage={getNestedErrorMessage(errors, 'castingTechnologyId')}
        />
      )}
    />
  )
}

export function AirSetCastingSpecificFields({ control, errors, options }: DynamicFieldsProps) {
  return (
    <Controller
      name="castingTechnologyId"
      control={control}
      render={({ field, fieldState }) => (
        <FormSelectField
          field={field}
          fieldState={fieldState}
          options={options.genderOptions}
          isVirtualized
          isClearable
          placeholder="Технологія формовки"
          errorMessage={getNestedErrorMessage(errors, 'castingTechnologyId')}
        />
      )}
    />
  )
}
