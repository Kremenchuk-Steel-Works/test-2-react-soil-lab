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
import type { CityLookupResponse } from "../../city/types/response.dto"
import { useQuery } from "@tanstack/react-query"
import { cityService } from "../../city/services/service"
import AlertMessage, { AlertType } from "../../../../components/AlertMessage"
import type { Option } from "../../../../components/Select/ReactSelect"

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

  // Query
  const {
    data: citiesData,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<CityLookupResponse[], Error>({
    queryKey: ["adminCityLookupData"],
    queryFn: () => cityService.getLookup(),
  })

  // Loading || Error
  if (isLoading) return
  if (isError) {
    return <AlertMessage type={AlertType.ERROR} message={queryError.message} />
  }

  // Options
  const citiesOptions: Option[] =
    citiesData?.map((c) => ({
      value: c.id,
      label: c.name,
    })) || []

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
