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
import { getFieldError } from "../../../../utils/zodHelpers"
import { addressSchema, type AddressFormFields } from "./schema"
import { formTransformers } from "../../../../utils/formTransformers"

export type FormFields = {
  addresses: AddressFormFields[]
}

interface FormProps<T extends FormFields> {
  index: number
  control: Control<T>
  register: UseFormRegister<T>
  errors: FieldErrors<T>
}

export function AddressForm<T extends FormFields>({
  index,
  control,
  register,
  errors,
}: FormProps<T>) {
  const err = errors as FieldErrors<FormFields>
  const addressOptions = [
    ...addressSchema.shape.type.options.map((value) => ({
      value,
      label: (() => {
        switch (value) {
          case "billing":
            return "Виставлення рахунків"
          case "shipping":
            return "Доставка"
          case "warehouse":
            return "Склад"
          case "plant":
            return "Завод"
          case "office":
            return "Офіс"
          case "home":
            return "Домашня адреса"
          default:
            return "Невідомо"
        }
      })(),
    })),
  ]

  return (
    <div className="space-y-3">
      <h4 className="layout-text">Адреса {index + 1}</h4>

      <CheckboxWithError
        label="Основна"
        {...register(
          `addresses.${index}.isPrimary` as Path<T>,
          formTransformers.string
        )}
        errorMessage={err.addresses?.[index]?.isPrimary?.message}
      />

      <InputFieldWithError
        label="Вулиця"
        {...register(
          `addresses.${index}.street` as Path<T>,
          formTransformers.string
        )}
        errorMessage={err.addresses?.[index]?.street?.message}
      />

      <InputFieldWithError
        label="Місто"
        {...register(
          `addresses.${index}.cityName` as Path<T>,
          formTransformers.string
        )}
        errorMessage={err.addresses?.[index]?.cityName?.message}
      />

      <InputFieldWithError
        label="Країна"
        {...register(
          `addresses.${index}.countryName` as Path<T>,
          formTransformers.string
        )}
        errorMessage={err.addresses?.[index]?.countryName?.message}
      />

      <InputFieldWithError
        label="Поштовий код"
        {...register(
          `addresses.${index}.postalCode` as Path<T>,
          formTransformers.string
        )}
        errorMessage={err.addresses?.[index]?.postalCode?.message}
      />

      <Controller
        name={`addresses.${index}.type` as Path<T>}
        control={control}
        render={({ field }) => (
          <ReactSelectWithError
            placeholder="Оберіть тип"
            isClearable={true}
            options={addressOptions}
            value={addressOptions.find((opt) => opt.value === field.value)}
            onChange={(option) => field.onChange(option?.value)}
            errorMessage={getFieldError(err.addresses?.[index]?.type)}
          />
        )}
      />

      <InputFieldWithError
        label="Примітка"
        {...register(
          `addresses.${index}.note` as Path<T>,
          formTransformers.string
        )}
        errorMessage={err.addresses?.[index]?.note?.message}
      />
    </div>
  )
}
