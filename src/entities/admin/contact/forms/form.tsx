import {
  Controller,
  type Control,
  type FieldErrors,
  type Path,
  type UseFormRegister,
} from 'react-hook-form'
import type { ContactFormFields } from '@/entities/admin/contact/forms/schema'
import { contactOptions } from '@/entities/admin/contact/types/contact'
import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
import FormSelectField from '@/shared/ui/forms/FormReactSelect'
import { CheckboxWithError, InputFieldWithError } from '@/shared/ui/with-error/fieldsWithError'

type FormFields = {
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
    <>
      <CheckboxWithError
        label="Основний"
        {...register(`contacts.${index}.isPrimary` as Path<T>, formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, `contacts.${index}.isPrimary` as Path<T>)}
      />

      <Controller
        name={`contacts.${index}.type` as Path<T>}
        control={control}
        render={({ field, fieldState }) => (
          <FormSelectField
            field={field}
            fieldState={fieldState}
            options={contactOptions}
            isVirtualized
            isClearable
            placeholder="Оберіть тип"
            errorMessage={getNestedErrorMessage(errors, `contacts.${index}.type` as Path<T>)}
          />
        )}
      />

      <InputFieldWithError
        label="Значення"
        {...register(`contacts.${index}.value` as Path<T>, formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, `contacts.${index}.value` as Path<T>)}
      />

      <InputFieldWithError
        label="Примітка"
        {...register(`contacts.${index}.note` as Path<T>, formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, `contacts.${index}.note` as Path<T>)}
      />
    </>
  )
}
