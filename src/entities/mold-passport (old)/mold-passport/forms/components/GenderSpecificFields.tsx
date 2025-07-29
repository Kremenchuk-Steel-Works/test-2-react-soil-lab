import { Controller } from 'react-hook-form'
import type { MoldPassportDynamicFieldOptionsOld } from '@/entities/mold-passport (old)/mold-passport/forms/configs/dynamic-fields'
import { getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
import type { DynamicComponentProps } from '@/shared/lib/zod/dynamic-schema'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'

type DynamicFieldsProps = DynamicComponentProps<MoldPassportDynamicFieldOptionsOld>

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
          options={options.loadAsyncOrganizationOptions}
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
