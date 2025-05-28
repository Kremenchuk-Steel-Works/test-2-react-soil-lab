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

export type FormFields = {
  contacts: ContactFormFields[]
}

interface FormProps<T extends FormFields> {
  control: Control<T>
  register: UseFormRegister<T>
  errors: FieldErrors<T>
}

export function ContactForm<T extends FormFields>({
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
      <h4 className="layout-text">Контакт</h4>

      <CheckboxWithError
        label="Основний"
        {...register(`contacts.${0}.isPrimary` as Path<T>)}
        errorMessage={err.contacts?.[0]?.isPrimary?.message}
      />

      <Controller
        name={`contacts.${0}.type` as Path<T>}
        control={control}
        render={({ field }) => (
          <ReactSelectWithError
            placeholder="Оберіть тип"
            isClearable={true}
            options={contactOptions}
            value={contactOptions.find((opt) => opt.value === field.value)}
            onChange={(option) => field.onChange(option?.value)}
            errorMessage={getFieldError(err.contacts?.type)}
          />
        )}
      />

      <InputFieldWithError
        label="Значення"
        {...register(`contacts.${0}.value` as Path<T>)}
        errorMessage={err.contacts?.[0]?.value?.message}
      />

      <InputFieldWithError
        label="Примітка"
        {...register(`contacts.${0}.note` as Path<T>)}
        errorMessage={err.contacts?.[0]?.note?.message}
      />
    </div>
  )
}
