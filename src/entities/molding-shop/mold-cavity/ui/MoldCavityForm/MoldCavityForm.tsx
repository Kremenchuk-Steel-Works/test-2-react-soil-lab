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
import { castingPatternService } from '@/entities/molding-shop/casting-pattern/api/service'
import type { MoldCavityFormFields } from '@/entities/molding-shop/mold-cavity/ui/MoldCavityForm/schema'
import { MoldCoreForm } from '@/entities/molding-shop/mold-core/ui/MoldCoreForm/MoldCoreForm'
import { moldCoreFormDefaultValues } from '@/entities/molding-shop/mold-core/ui/MoldCoreForm/schema'
import type { CountryLookupResponse } from '@/shared/api/main-service/model'
import { useSelectOptions } from '@/shared/hooks/react-hook-form/options/useSelectOptions'
import { useParallelQueries } from '@/shared/hooks/react-query/useParallelQueries'
import { getErrorMessage } from '@/shared/lib/axios'
import { formTransformers, getNestedErrorMessage } from '@/shared/lib/react-hook-form/nested-error'
import AlertMessage, { AlertType } from '@/shared/ui/alert-message/AlertMessage'
import { DynamicFieldArray } from '@/shared/ui/react-hook-form/dynamic-fields/DynamicFieldArray'
import FormSelectField from '@/shared/ui/react-hook-form/fields/FormReactSelect'
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
  // Queries
  const {
    data: queriesData,
    isLoading: isQueriesLoading,
    error: queriesError,
  } = useParallelQueries({
    castingPatterns: castingPatternService.getLookup(),
  })

  // Loading || Error
  if (isQueriesLoading) return
  if (queriesError) {
    return <AlertMessage type={AlertType.ERROR} message={getErrorMessage(queriesError)} />
  }

  // Options
  const castingPatternsOptions = useSelectOptions(
    queriesData?.castingPatterns as CountryLookupResponse[] | undefined,
    {
      getValue: (c) => c.id,
      getLabel: (c) => c.name,
    },
  )

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
            options={castingPatternsOptions}
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
        defaultItem={moldCoreFormDefaultValues as FieldArray<T, ArrayPath<T>>}
        control={control}
        register={register}
        errors={errors}
      />
    </>
  )
}
