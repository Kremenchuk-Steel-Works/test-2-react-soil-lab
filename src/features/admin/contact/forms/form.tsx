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
import { contactSchema, type ContactFormFields } from "./schema"
import { getFieldError } from "../../../../utils/zodHelpers"
import { formTransformers } from "../../../../utils/formTransformers"

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
  const err = errors as FieldErrors<FormFields>
  const contactOptions = [
    ...contactSchema.shape.type.options.map((value) => ({
      value,
      label: (() => {
        switch (value) {
          case "email":
            return "Email"
          case "phone":
            return "Телефон"
          case "telegram":
            return "Телеграм"
          case "linkedin":
            return "Linkedin"
          case "website":
            return "Сайт"
          default:
            return "Невідомо"
        }
      })(),
    })),
  ]
  return (
    <div className="space-y-3">
      <h4 className="layout-text">Контакт {index + 1}</h4>

      <CheckboxWithError
        label="Основний"
        {...register(
          `contacts.${index}.isPrimary` as Path<T>,
          formTransformers.string
        )}
        errorMessage={err.contacts?.[index]?.isPrimary?.message}
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
            errorMessage={getFieldError(err.contacts?.[index]?.type)}
          />
        )}
      />

      <InputFieldWithError
        label="Значення"
        {...register(
          `contacts.${index}.value` as Path<T>,
          formTransformers.string
        )}
        errorMessage={err.contacts?.[index]?.value?.message}
      />

      <InputFieldWithError
        label="Примітка"
        {...register(
          `contacts.${index}.note` as Path<T>,
          formTransformers.string
        )}
        errorMessage={err.contacts?.[index]?.note?.message}
      />
    </div>
  )
}
