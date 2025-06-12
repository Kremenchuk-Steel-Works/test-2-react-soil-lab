import {
  Controller,
  type Control,
  type FieldErrors,
  type Path,
  type UseFormRegister,
} from "react-hook-form"
import {
  InputFieldWithError,
  ReactSelectWithError,
} from "../../../../components/WithError/fieldsWithError"
import type { EmployeeProfileFormFields } from "./schema"
import { employeeProfileOptions } from "../types/employmentStatus"
import FormDateField from "../../../../components/Forms/FormDateField"
import {
  formTransformers,
  getNestedErrorMessage,
} from "../../../../lib/react-hook-form"

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
        name={"employeeProfile.employmentStatus" as Path<T>}
        control={control}
        render={({ field }) => (
          <ReactSelectWithError
            placeholder="Оберіть статус працевлаштування"
            isClearable={true}
            options={employeeProfileOptions}
            value={employeeProfileOptions.find(
              (opt) => opt.value === field.value
            )}
            onChange={(option) => field.onChange(option?.value)}
            errorMessage={getNestedErrorMessage(
              errors,
              "employeeProfile.employmentStatus" as Path<T>
            )}
          />
        )}
      />
    </div>
  )
}
