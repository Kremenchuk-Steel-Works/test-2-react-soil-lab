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

export type FormFields = {
  addresses: AddressFormFields[]
}

interface FormProps<T extends FormFields> {
  control: Control<T>
  register: UseFormRegister<T>
  errors: FieldErrors<T>
}

export function AddressForm<T extends FormFields>({
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
      <h4 className="layout-text">Адреса</h4>

      <CheckboxWithError
        label="Основна"
        {...register(`addresses.${0}.isPrimary` as Path<T>)}
        errorMessage={err.addresses?.[0]?.isPrimary?.message}
      />

      <InputFieldWithError
        label="Вулиця"
        {...register(`addresses.${0}.street` as Path<T>)}
        errorMessage={err.addresses?.[0]?.street?.message}
      />

      <InputFieldWithError
        label="Місто"
        {...register(`addresses.${0}.cityName` as Path<T>)}
        errorMessage={err.addresses?.[0]?.cityName?.message}
      />

      <InputFieldWithError
        label="Країна"
        {...register(`addresses.${0}.countryName` as Path<T>)}
        errorMessage={err.addresses?.[0]?.countryName?.message}
      />

      <InputFieldWithError
        label="Поштовий код"
        {...register(`addresses.${0}.postalCode` as Path<T>)}
        errorMessage={err.addresses?.[0]?.postalCode?.message}
      />

      <Controller
        name={`addresses.${0}.type` as Path<T>}
        control={control}
        render={({ field }) => (
          <ReactSelectWithError
            placeholder="Оберіть тип"
            isClearable={true}
            options={addressOptions}
            value={addressOptions.find((opt) => opt.value === field.value)}
            onChange={(option) => field.onChange(option?.value)}
            errorMessage={getFieldError(err.addresses?.type)}
          />
        )}
      />

      <InputFieldWithError
        label="Примітка"
        {...register(`addresses.${0}.note` as Path<T>)}
        errorMessage={err.addresses?.[0]?.note?.message}
      />
    </div>
  )
}
