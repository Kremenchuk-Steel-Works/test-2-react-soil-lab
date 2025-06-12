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
  CheckboxWithError,
} from "../../../../components/WithError/fieldsWithError"
import { contactOptions } from "../types/contact"
import type { ContactFormFields } from "./schema"
import {
  formTransformers,
  getNestedErrorMessage,
} from "../../../../lib/react-hook-form"

export type FormFields = {
  contacts: ContactFormFields[]
}

interface FormProps<T extends FormFields> {
  index: number
  control: Control<T>
  register: UseFormRegister<T>
  errors: FieldErrors<T>
}

export function ContactForm<T extends FormFields>({
  index,
  control,
  register,
  errors,
}: FormProps<T>) {
  return (
    <div className="space-y-3">
      <h4 className="layout-text">Контактні дані {index + 1}</h4>

      <CheckboxWithError
        label="Основний"
        {...register(
          `contacts.${index}.isPrimary` as Path<T>,
          formTransformers.string
        )}
        errorMessage={getNestedErrorMessage(
          errors,
          `contacts.${index}.isPrimary` as Path<T>
        )}
      />

      <Controller
        name={`contacts.${index}.type` as Path<T>}
        control={control}
        render={({ field }) => (
          <ReactSelectWithError
            placeholder="Оберіть тип"
            isClearable={true}
            options={contactOptions}
            value={contactOptions.find((opt) => opt.value === field.value)}
            onChange={(option) => field.onChange(option?.value)}
            errorMessage={getNestedErrorMessage(
              errors,
              `contacts.${index}.type` as Path<T>
            )}
          />
        )}
      />

      <InputFieldWithError
        label="Значення"
        {...register(
          `contacts.${index}.value` as Path<T>,
          formTransformers.string
        )}
        errorMessage={getNestedErrorMessage(
          errors,
          `contacts.${index}.value` as Path<T>
        )}
      />

      <InputFieldWithError
        label="Примітка"
        {...register(
          `contacts.${index}.note` as Path<T>,
          formTransformers.string
        )}
        errorMessage={getNestedErrorMessage(
          errors,
          `contacts.${index}.note` as Path<T>
        )}
      />
    </div>
  )
}
