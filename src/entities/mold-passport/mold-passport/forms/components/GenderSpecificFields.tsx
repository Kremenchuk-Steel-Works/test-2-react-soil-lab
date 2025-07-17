import { Controller } from 'react-hook-form'
import type { MoldPassportDynamicFieldOptions } from '@/entities/mold-passport/mold-passport/forms/config'
import { getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
import type { DynamicComponentProps } from '@/shared/lib/zod'
import FormSelectField from '@/shared/ui/forms/FormReactSelect'

type DynamicFieldsProps = DynamicComponentProps<MoldPassportDynamicFieldOptions>

export function MaleSpecificFields({ control, errors, options }: DynamicFieldsProps) {
  return (
    <Controller
      name="test"
      control={control}
      render={({ field, fieldState }) => (
        <FormSelectField
          field={field}
          fieldState={fieldState}
          options={options.organizationsOptions}
          isVirtualized
          isMulti
          isClearable
          placeholder="Оберіть організацію"
          errorMessage={getNestedErrorMessage(errors, 'test')}
        />
      )}
    />
  )
}

export function FemaleSpecificFields({ control, errors, options }: DynamicFieldsProps) {
  return (
    <Controller
      name="test"
      control={control}
      render={({ field, fieldState }) => (
        <FormSelectField
          field={field}
          fieldState={fieldState}
          options={options.positionsOptions}
          isVirtualized
          isMulti
          isClearable
          placeholder="Оберіть посаду"
          errorMessage={getNestedErrorMessage(errors, 'test')}
        />
      )}
    />
  )
}
