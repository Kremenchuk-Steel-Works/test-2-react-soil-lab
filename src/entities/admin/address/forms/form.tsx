import {
  Controller,
  type Control,
  type FieldErrors,
  type Path,
  type UseFormRegister,
} from "react-hook-form"
import {
  InputFieldWithError,
  CheckboxWithError,
} from '@/shared/ui/with-error/fieldsWithError'
import type { AddressFormFields } from '@/entities/admin/address/forms/schema'
import { addressOptions } from '@/entities/admin/address/types/address'
import type { CityLookupResponse } from '@/entities/admin/city/types/response.dto'
import { useQuery } from "@tanstack/react-query"
import { cityService } from '@/entities/admin/city/services/service'
import AlertMessage, {
  AlertType,
} from '@/shared/ui/alert-message/AlertMessage'
import {
  formTransformers,
  getNestedErrorMessage,
} from '@/shared/lib/react-hook-form'
import { cityQueryKeys } from '@/entities/admin/city/services/keys'
import type { Option } from '@/shared/ui/select/ReactSelect'
import FormSelectField from '@/shared/ui/forms/FormReactSelect'

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
  // Query
  const {
    data: citiesData,
    isLoading,
    isError,
    error: queryError,
  } = useQuery<CityLookupResponse[], Error>({
    queryKey: cityQueryKeys.lookups(),
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
        errorMessage={getNestedErrorMessage(
          errors,
          `addresses.${index}.isPrimary` as Path<T>
        )}
      />

      <Controller
        name={`addresses.${index}.cityId` as Path<T>}
        control={control}
        render={({ field, fieldState }) => (
          <FormSelectField
            field={field}
            fieldState={fieldState}
            options={citiesOptions}
            isVirtualized
            isClearable
            placeholder="Оберіть місто"
            errorMessage={getNestedErrorMessage(
              errors,
              `addresses.${index}.cityId` as Path<T>
            )}
          />
        )}
      />

      <InputFieldWithError
        label="Вулиця"
        {...register(
          `addresses.${index}.street` as Path<T>,
          formTransformers.string
        )}
        errorMessage={getNestedErrorMessage(
          errors,
          `addresses.${index}.street` as Path<T>
        )}
      />

      <InputFieldWithError
        label="Поштовий код"
        {...register(
          `addresses.${index}.postalCode` as Path<T>,
          formTransformers.string
        )}
        errorMessage={getNestedErrorMessage(
          errors,
          `addresses.${index}.postalCode` as Path<T>
        )}
      />

      <Controller
        name={`addresses.${index}.type` as Path<T>}
        control={control}
        render={({ field, fieldState }) => (
          <FormSelectField
            field={field}
            fieldState={fieldState}
            options={addressOptions}
            isVirtualized
            isClearable
            placeholder="Оберіть тип"
            errorMessage={getNestedErrorMessage(
              errors,
              `addresses.${index}.type` as Path<T>
            )}
          />
        )}
      />

      <InputFieldWithError
        label="Примітка"
        {...register(
          `addresses.${index}.note` as Path<T>,
          formTransformers.string
        )}
        errorMessage={getNestedErrorMessage(
          errors,
          `addresses.${index}.note` as Path<T>
        )}
      />
    </div>
  )
}
