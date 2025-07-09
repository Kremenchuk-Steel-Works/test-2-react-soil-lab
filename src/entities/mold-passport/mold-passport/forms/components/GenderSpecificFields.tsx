import { useFormState, type Control } from 'react-hook-form'
import { getNestedErrorMessage } from '@/shared/lib/react-hook-form'
import { InputFieldWithError } from '@/shared/ui/with-error/fieldsWithError'

interface SpecificFieldsProps {
  control: Control<any>
}

export function MaleSpecificFields({ control }: SpecificFieldsProps) {
  const { errors } = useFormState({ control })
  return (
    <div className="space-y-3 rounded-md border border-blue-200 bg-blue-50 p-4">
      <h3 className="font-semibold text-gray-700">Військовий облік</h3>
      <InputFieldWithError
        label="Номер військового квитка"
        {...control.register('militaryId')}
        errorMessage={getNestedErrorMessage(errors, 'militaryId')}
      />
    </div>
  )
}

export function FemaleSpecificFields({ control }: SpecificFieldsProps) {
  const { errors } = useFormState({ control })
  return (
    <div className="space-y-3 rounded-md border border-pink-200 bg-pink-50 p-4">
      <h3 className="font-semibold text-gray-700">Додаткова інформація</h3>
      <InputFieldWithError
        label="Дівоче прізвище"
        {...control.register('maidenName')}
        errorMessage={getNestedErrorMessage(errors, 'maidenName')}
      />
      <InputFieldWithError
        label="Номер військового квитка"
        {...control.register('militaryId')}
        errorMessage={getNestedErrorMessage(errors, 'militaryId')}
      />
    </div>
  )
}
