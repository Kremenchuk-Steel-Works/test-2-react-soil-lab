import type { MoldPassportDynamicFieldOptions } from '@/entities/mold-passport/mold-passport/forms/configs/dynamic-fields'
import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
import type { DynamicComponentProps } from '@/shared/lib/zod'
import { FieldsetWrapper } from '@/shared/ui/react-hook-form/FieldsetWrapper'
import { InputFieldWithError } from '@/shared/ui/with-error/fieldsWithError'

type DynamicFieldsProps = DynamicComponentProps<MoldPassportDynamicFieldOptions>

export function MaksimSpecificFields({ control, errors }: DynamicFieldsProps) {
  return (
    <FieldsetWrapper title="Поля для Максим" className="rounded-lg">
      <InputFieldWithError
        label="Ідентифікатор"
        {...control.register('identifier', { ...formTransformers.string })}
        errorMessage={getNestedErrorMessage(errors, 'identifier')}
      />
      <InputFieldWithError
        label="Кількість букв"
        type="number"
        {...control.register('letterCount', { ...formTransformers.number })}
        errorMessage={getNestedErrorMessage(errors, 'letterCount')}
      />
    </FieldsetWrapper>
  )
}
