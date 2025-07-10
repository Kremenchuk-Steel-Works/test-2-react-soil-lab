import { useFormState, type Control } from 'react-hook-form'
import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form'
import { FieldsetWrapper } from '@/shared/ui/forms/FieldsetWrapper'
import { InputFieldWithError } from '@/shared/ui/with-error/fieldsWithError'

interface SpecificFieldsProps {
  control: Control<any>
}

export function MaksimSpecificFields({ control }: SpecificFieldsProps) {
  const { errors } = useFormState({ control })
  return (
    <FieldsetWrapper title="Поля для Максим">
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
