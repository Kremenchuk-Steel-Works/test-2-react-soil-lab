import {
  Controller,
  type Control,
  type FieldErrors,
  type Path,
  type UseFormRegister,
} from "react-hook-form"
import { InputFieldWithError } from '@/shared/ui/with-error/fieldsWithError'
import type { EmployeeProfileFormFields } from '@/entities/admin/employeeProfile/forms/schema'
import { employeeProfileOptions } from '@/entities/admin/employeeProfile/types/employmentStatus'
import FormDateField from '@/shared/ui/forms/FormDateField'
import {
  formTransformers,
  getNestedErrorMessage,
} from '@/shared/lib/react-hook-form'
import FormSelectField from '@/shared/ui/forms/FormReactSelect'

export type FormFields = {
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
    <div className="space-y-3">
      <h4 className="layout-text">Профіль робітника</h4>

      <InputFieldWithError
        label="Номер робітника"
        type="number"
        {...register(
          "employeeProfile.employeeNumber" as Path<T>,
          formTransformers.string
        )}
        errorMessage={getNestedErrorMessage(
          errors,
          "employeeProfile.employeeNumber" as Path<T>
        )}
      />

      <Controller
        name={"employeeProfile.hiredAt" as Path<T>}
        control={control}
        render={({ field, fieldState }) => (
          <FormDateField
            field={field}
            fieldState={fieldState}
            minDate={new Date("1800-01-01")}
            label="Дата найму"
            errorMessage={getNestedErrorMessage(
              errors,
              "employeeProfile.hiredAt" as Path<T>
            )}
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
              `employeeProfile.employmentStatus` as Path<T>
            )}
          />
        )}
      />
    </div>
  )
}
