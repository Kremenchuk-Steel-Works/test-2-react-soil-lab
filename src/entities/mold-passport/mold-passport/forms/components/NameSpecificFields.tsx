import { useFormState, type Control } from 'react-hook-form'
import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form'
import { InputFieldWithError } from '@/shared/ui/with-error/fieldsWithError'

interface SpecificFieldsProps {
  control: Control<any>
}

export function MaksimSpecificFields({ control }: SpecificFieldsProps) {
  const { errors } = useFormState({ control })
  return (
    <div className="space-y-3 rounded-md border border-green-200 bg-green-50 p-4">
      <h3 className="font-semibold text-gray-700">Поля для "Максим"</h3>
      <InputFieldWithError
        label="Ідентифікатор"
        {...control.register('identifier')}
        errorMessage={getNestedErrorMessage(errors, 'identifier')}
      />
      <InputFieldWithError
        label="Кількість букв"
        type="number"
        {...control.register('letterCount', { ...formTransformers.number })}
        errorMessage={getNestedErrorMessage(errors, 'letterCount')}
      />
    </div>
  )
}

export function Maksim2SpecificFields({ control }: SpecificFieldsProps) {
  const { errors } = useFormState({ control })
  return (
    <div className="space-y-3 rounded-md border border-yellow-200 bg-yellow-50 p-4">
      <h3 className="font-semibold text-gray-700">Поля для "Максим 2"</h3>
      <InputFieldWithError
        label="Ідентифікатор"
        {...control.register('identifier')}
        errorMessage={getNestedErrorMessage(errors, 'identifier')}
      />
    </div>
  )
}
