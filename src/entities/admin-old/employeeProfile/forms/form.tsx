import {
  Controller,
  type Control,
  type FieldErrors,
  type Path,
  type UseFormRegister,
} from 'react-hook-form'
import type { EmployeeProfileFormFields } from '@/entities/admin-old/employeeProfile/forms/schema'
import { employeeProfileOptions } from '@/entities/admin-old/employeeProfile/types/employmentStatus'
import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
import FormDateTimeField from '@/shared/ui/react-hook-form/fields/FormDateTimeField'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
import { InputFieldWithError } from '@/shared/ui/with-error/fieldsWithError'

type FormFields = {
  employeeProfile?: EmployeeProfileFormFields
}

interface FormProps<T extends FormFields> {
  control: Control<T>
  register: UseFormRegister<T>
  errors: FieldErrors<T>
}

export function EmployeeProfileForm<T extends FormFields>({
  control,
  register,
  errors,
}: FormProps<T>) {
  return (
    <>
      <InputFieldWithError
        label="Номер робітника"
        type="number"
        {...register('employeeProfile.employeeNumber' as Path<T>, formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, 'employeeProfile.employeeNumber' as Path<T>)}
      />

      <Controller
        name={'employeeProfile.hiredAt' as Path<T>}
        control={control}
        render={({ field, fieldState }) => (
          <FormDateTimeField
            field={field}
            fieldState={fieldState}
            label="Дата найму"
            errorMessage={getNestedErrorMessage(errors, 'employeeProfile.hiredAt' as Path<T>)}
          />
        )}
      />

      <Controller
        name={`employeeProfile.employmentStatus` as Path<T>}
        control={control}
        render={({ field, fieldState }) => (
          <FormSelectField
            field={field}
            fieldState={fieldState}
            options={employeeProfileOptions}
            isVirtualized
            isClearable
            placeholder="Оберіть статус працевлаштування"
            errorMessage={getNestedErrorMessage(
              errors,
              `employeeProfile.employmentStatus` as Path<T>,
            )}
          />
        )}
      />
    </>
  )
}
