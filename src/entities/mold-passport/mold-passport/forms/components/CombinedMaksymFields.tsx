import type { MoldPassportDynamicFieldOptions } from '@/entities/mold-passport/mold-passport/forms/configs/dynamic-fields'
import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
import type { DynamicComponentProps } from '@/shared/lib/zod/dynamic-schema'
import { InputFieldWithError } from '@/shared/ui/with-error/fieldsWithError'

type DynamicFieldsProps = DynamicComponentProps<MoldPassportDynamicFieldOptions>

export function CombinedMaksymFields({ control, errors }: DynamicFieldsProps) {
  return (
    <div className="space-y-3 rounded-md border border-green-200 bg-green-50 px-4 py-2 pb-4 dark:border-green-900/50 dark:bg-green-950/50">
      <h3 className="font-semibold text-gray-700 dark:text-gray-300">
        Певні умови для "Максим Максим чоловік | інша"
      </h3>
      <InputFieldWithError
        label="Дівоче прізвище"
        {...control.register('maidenName', { ...formTransformers.string })}
        errorMessage={getNestedErrorMessage(errors, 'maidenName')}
      />
    </div>
  )
}
