import { Controller } from 'react-hook-form'
import type { MoldPassportDynamicFieldOptions } from '@/entities/molding-shop/mold-passport/ui/MoldPassportForm/configs/dynamic-fields'
import { moldingSandSystemOptions } from '@/entities/molding-shop/molding-sand-type/model/moldingSandSystem'
import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
import type { DynamicComponentProps } from '@/shared/lib/zod/dynamic-schema'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
import { FieldsetWrapper } from '@/shared/ui/react-hook-form/FieldsetWrapper'
import { InputFieldWithError } from '@/shared/ui/with-error/fieldsWithError'

type DynamicFieldsProps = DynamicComponentProps<MoldPassportDynamicFieldOptions>

export function CastingTechnologyDataGscDynamicForm({ control, errors }: DynamicFieldsProps) {
  return (
    <FieldsetWrapper title={`Пісочно-глиняна формовка`}>
      <Controller
        name="moldingSandSystem"
        control={control}
        render={({ field, fieldState }) => (
          <FormSelectField
            field={field}
            fieldState={fieldState}
            options={moldingSandSystemOptions}
            isDisabled
            isVirtualized
            isClearable
            placeholder="Підтип суміші"
            errorMessage={getNestedErrorMessage(errors, 'moldingSandSystem')}
          />
        )}
      />

      <InputFieldWithError
        label="Номер суміші"
        {...control.register('moldingSandNumber', { ...formTransformers.string })}
        errorMessage={getNestedErrorMessage(errors, 'moldingSandNumber')}
      />

      <InputFieldWithError
        label="Горизонтальна щільність форми"
        {...control.register('moldHorizontalDensity', { ...formTransformers.string })}
        errorMessage={getNestedErrorMessage(errors, 'moldHorizontalDensity')}
      />

      <InputFieldWithError
        label="Вертикальна щільність форми"
        {...control.register('moldVerticalDensity', { ...formTransformers.string })}
        errorMessage={getNestedErrorMessage(errors, 'moldVerticalDensity')}
      />
    </FieldsetWrapper>
  )
}

export function CastingTechnologyPassportDataAscDynamicForm({
  control,
  errors,
  options,
}: DynamicFieldsProps) {
  return (
    <FieldsetWrapper title={`Холодно-твердіюча формовка`}>
      <InputFieldWithError
        label="Твердість форми"
        {...control.register('moldHardness', { ...formTransformers.string })}
        errorMessage={getNestedErrorMessage(errors, 'moldHardness')}
      />

      <Controller
        name="resinId"
        control={control}
        render={({ field, fieldState }) => (
          <FormSelectField
            field={field}
            fieldState={fieldState}
            options={options.resinsOptions}
            isVirtualized
            isClearable
            placeholder="Смола"
            errorMessage={getNestedErrorMessage(errors, 'resinId')}
          />
        )}
      />
    </FieldsetWrapper>
  )
}
