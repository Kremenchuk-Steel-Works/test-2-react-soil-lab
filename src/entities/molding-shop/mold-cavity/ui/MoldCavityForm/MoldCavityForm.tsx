import { useQuery } from '@tanstack/react-query'
import {
  Controller,
  type ArrayPath,
  type Control,
  type FieldArray,
  type FieldErrors,
  type FieldValues,
  type Path,
  type UseFormRegister,
} from 'react-hook-form'
import { cityQueryKeys } from '@/entities/admin/city/services/keys'
import { cityService } from '@/entities/admin/city/services/service'
import type { CityLookupResponse } from '@/entities/admin/city/types/response.dto'
import type { MoldCavityFormFields } from '@/entities/molding-shop/mold-cavity/ui/MoldCavityForm/schema'
import { MoldCoreForm } from '@/entities/molding-shop/mold-core/ui/MoldCoreForm/MoldCoreForm'
import { moldCoreDefault } from '@/entities/molding-shop/mold-core/ui/MoldCoreForm/schema'
import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import { DynamicFieldArray } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldArray'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
import type { Option } from '@/shared/ui/select/ReactSelect'
import { CheckboxWithError, InputFieldWithError } from '@/shared/ui/with-error/fieldsWithError'

type FormFields = MoldCavityFormFields

interface FormProps<T extends FieldValues> {
  index: number
  name: ArrayPath<T>
  control: Control<T>
  register: UseFormRegister<T>
  errors: FieldErrors<T>
}

export function MoldCavityForm<T extends FieldValues>({
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

  // Формируем полный путь до вложенного массива
  const coresFieldName = `${name}.${index}.moldCores`

  return (
    <>
      <Controller
        name={fieldName('castingPatternId')}
        control={control}
        render={({ field, fieldState }) => (
          <FormSelectField
            field={field}
            fieldState={fieldState}
            options={citiesOptions}
            isVirtualized
            isClearable
            placeholder="Модель"
            errorMessage={getNestedErrorMessage(errors, fieldName('castingPatternId'))}
          />
        )}
      />

      <InputFieldWithError
        label="Серійний номер"
        {...register(fieldName('serialNumber'), formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, fieldName('serialNumber'))}
      />

      <CheckboxWithError
        label="Придатне для заливання металу"
        {...register(fieldName('isFunctional'), formTransformers.string)}
        errorMessage={getNestedErrorMessage(errors, fieldName('isFunctional'))}
      />

      {/* Cores */}
      <DynamicFieldArray
        title="Стрижень"
        label="стрижень"
        name={coresFieldName as ArrayPath<T>}
        form={MoldCoreForm}
        defaultItem={moldCoreDefault as FieldArray<T, ArrayPath<T>>}
        control={control}
        register={register}
        errors={errors}
      />

      <Controller
        name={fieldName('experimentIds')}
        control={control}
        render={({ field, fieldState }) => (
          <FormSelectField
            field={field}
            fieldState={fieldState}
            options={citiesOptions}
            isMulti
            isVirtualized
            isClearable
            placeholder="Експеримент"
            errorMessage={getNestedErrorMessage(errors, fieldName('experimentIds'))}
          />
        )}
      />
    </>
  )
}
