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
import type { AddressFormFields } from "./schema"
import { formTransformers } from "../../../../utils/formTransformers"
import { addressOptions } from "../types/address"
import { mockCities } from "../../city/mocks/mock"

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

  const citiesData = mockCities
  const citiesOptions = [
    ...citiesData.map((obj) => ({
      value: obj.id,
      label: obj.name,
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

      <Controller
        name={`addresses.${index}.cityId` as Path<T>}
        control={control}
        render={({ field }) => (
          <ReactSelectWithError
            placeholder="Оберіть місто"
            isClearable={true}
            options={citiesOptions}
            value={citiesOptions.find((opt) => opt.value === field.value)}
            onChange={(option) => field.onChange(option?.value)}
            errorMessage={err.addresses?.[index]?.cityId?.message}
          />
        )}
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
