import { useQuery } from '@tanstack/react-query'
import {
  Controller,
  type ArrayPath,
  type Control,
  type FieldErrors,
  type FieldValues,
  type Path,
  type UseFormRegister,
} from 'react-hook-form'
import { cityQueryKeys } from '@/entities/admin/city/services/keys'
import { cityService } from '@/entities/admin/city/services/service'
import type { CityLookupResponse } from '@/entities/admin/city/types/response.dto'
import type { MoldCoreFormFields } from '@/entities/molding-shop/mold-core/ui/MoldCoreForm/schema'
import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
import type { Option } from '@/shared/ui/select/ReactSelect'
import { InputFieldWithError } from '@/shared/ui/with-error/fieldsWithError'

type FormFields = MoldCoreFormFields

interface FormProps<T extends FieldValues> {
  index: number
  name: ArrayPath<T>
  control: Control<T>
  register: UseFormRegister<T>
  errors: FieldErrors<T>
}

export function MoldCoreForm<T extends FieldValues>({
  index,
  name,
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

  // Динамически строим пути к полям
  const fieldName = (field: keyof FormFields) => `${name}.${index}.${field}` as Path<T>

  return (
    <>
      <Controller
        name={fieldName('coreBatchId')}
        control={control}
        render={({ field, fieldState }) => (
          <FormSelectField
            field={field}
            fieldState={fieldState}
            options={citiesOptions}
            isVirtualized
            isClearable
            placeholder="Партія"
            errorMessage={getNestedErrorMessage(errors, fieldName('coreBatchId'))}
          />
        )}
      />

      <InputFieldWithError
        label="Твердість, од."
        {...register(fieldName('hardness'), formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, fieldName('hardness'))}
      />
    </>
  )
}
