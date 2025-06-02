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
import { formTransformers } from "../../../../utils/formTransformers"
import { employeeProfileOptions } from "../types/employmentStatus"

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
  const err = errors as FieldErrors<FormFields>

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
        errorMessage={err.employeeProfile?.employeeNumber?.message}
      />

      <InputFieldWithError
        label="Дата найму"
        type="date"
        {...register(
          "employeeProfile.hiredAt" as Path<T>,
          formTransformers.string
        )}
        errorMessage={err.employeeProfile?.hiredAt?.message}
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
            errorMessage={err.employeeProfile?.employmentStatus?.message}
          />
        )}
      />
    </div>
  )
}
