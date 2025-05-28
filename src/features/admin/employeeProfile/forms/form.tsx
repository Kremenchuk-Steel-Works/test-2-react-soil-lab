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
import { employeeProfileSchema, type EmployeeProfileFormFields } from "./schema"

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
  const employmentStatusOptions = [
    ...employeeProfileSchema.shape.employmentStatus.options.map((value) => ({
      value,
      label: (() => {
        switch (value) {
          case "intern":
            return "Стажер"
          case "full-time":
            return "Повна зайнятість"
          case "part-time":
            return "Неповна зайнятість"
          case "contract":
            return "Контракт"
          case "on-leave":
            return "У відпустці"
          case "suspended":
            return "Призупинено"
          case "terminated":
            return "Звільнений"
          case "retired":
            return "На пенсії"
          default:
            return "Невідомо"
        }
      })(),
    })),
  ]

  return (
    <div className="space-y-3">
      <h4 className="layout-text">Профіль робітника</h4>

      <InputFieldWithError
        label="Номер робітника"
        type="number"
        {...register("employeeProfile.employeeNumber" as Path<T>)}
        errorMessage={err.employeeProfile?.employeeNumber?.message}
      />

      <InputFieldWithError
        label="Дата найму"
        type="date"
        {...register("employeeProfile.hiredAt" as Path<T>)}
        errorMessage={err.employeeProfile?.hiredAt?.message}
      />

      <Controller
        name={"employeeProfile.employmentStatus" as Path<T>}
        control={control}
        render={({ field }) => (
          <ReactSelectWithError
            placeholder="Оберіть статус працевлаштування"
            isClearable={true}
            options={employmentStatusOptions}
            value={employmentStatusOptions.find(
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
